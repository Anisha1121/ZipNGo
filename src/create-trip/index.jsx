import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SelectBudgetOptions, SelectTravelList, AI_PROMPT } from "@/constants/options";
import PlacesAutocomplete from "@/components/PlacesAutcomplete";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!formData?.location || !formData?.days || !formData?.budget || !formData?.travelers) {
      toast("Please fill all details");
      return;
    }

    if (formData?.days > 10) {
      toast("Trip duration must be 10 days or less");
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData.location)
      .replace("{totaldays}", formData.days)
      .replace("{traveler}", formData.travelers)
      .replace("{budget}", formData.budget) +
      "\n\nRespond ONLY with a valid JSON object. Do NOT include markdown or explanation.";

    try {
      const result = await model.generateContent(FINAL_PROMPT);
      const response = result.response;
      let text = await response.text();

      console.log("Raw AI response text:", text);

      // Strip markdown (```json) if added
      text = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^\s*json\s*/gi, '')
        .trim();

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      const jsonString = text.slice(jsonStart, jsonEnd + 1);

      const parsedData = JSON.parse(jsonString);
      console.log("Parsed AI JSON:", parsedData);
      SaveAITrip(parsedData);
    } catch (error) {
      console.error("Gemini API Error:", error);
      toast.error("\u274C Failed to generate trip. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAITrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: TripData, // already parsed JSON
      userEmail: user?.email,
      id: docId
    });
    setLoading(false);
    navigate('/view-trip/'+docId);
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "Application/json"
        }
      })
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        OnGenerateTrip();
      });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="text-4xl font-bold">Tell us about your travel preferences 🎕️🌴</h2>
      <p className="text-xl text-gray-600">
        Just provide us with some details about your ideal trip, and we'll create a personalized itinerary just for you.
      </p>

      <div className="mt-20">
        <h2 className="text-2xl font-bold">Where are you planning to go?</h2>
<div className="my-3 text-lg">
  <PlacesAutocomplete
    onSelect={(city) => handleInputChange("location", city.place_name)}
  />
</div>


        <h2 className="text-2xl mt-6 font-bold">How many days are you planning the trip?</h2>
        <Input
          type="number"
          placeholder="Ex. 5"
          onChange={(e) => handleInputChange("days", e.target.value)}
          className="text-xl my-3 font-medium"
        />

        <h2 className="text-2xl my-3 font-bold">What is your budget for the trip?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`py-1 cursor-pointer space-y-1 px-3 text-xl hover:shadow-2xl hover:bg-gray-50 border rounded-lg ${formData.budget === item.title ? "bg-gray-100 border-black" : ""}`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <h2 className="text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>

        <h2 className="text-2xl mt-5 font-bold">Let us know how many travelers you're planning for.</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("travelers", item.people)}
              className={`py-2 cursor-pointer space-y-1 px-3.5 text-xl hover:shadow-2xl hover:bg-gray-50 border rounded-lg ${formData.travelers === item.people ? "bg-gray-100 border-black" : ""}`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <h2 className="text-xl text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end cursor-pointer my-10">
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : 'Generate Trip'}
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogTitle>Sign in</DialogTitle>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" className="w-12 h-12" />
              <h2 className="font-bold text-lg mt-6 flex gap-2 items-center">Sign In with Google</h2>
              <p className="text-sm text-muted-foreground mt-2 text-center">Sign in to the app with Google authentication securely</p>
              <Button disabled={loading} onClick={login} className="w-full mt-5 flex gap-2 justify-center items-center">
                {loading ? "Signing in..." : <><FcGoogle className="h-6 w-6" /> Sign In with Google</>}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;