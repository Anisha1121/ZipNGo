import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SelectBudgetOptions, SelectTravelList, AI_PROMPT } from "@/constants/options";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function CreateTrip() {
  const [formData, setFormData] = useState({});

  const [openDialog, setOpenDialog]= useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess:(codeResp)=>GetUserProfile(codeResp),
    onError:(error)=>console.log(error)
  })

  const OnGenerateTrip = async () => {
    
    const user = localStorage.getItem('user');

    if(!user){
      setOpenDialog(true)
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

    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData.location)
      .replace("{totaldays}", formData.days)
      .replace("{traveler}", formData.travelers)
      .replace("{budget}", formData.budget);

    try {
  console.log("Sending prompt to Gemini:", FINAL_PROMPT);

  const result = await model.generateContent(FINAL_PROMPT);
  const response = result.response;
  const text = await response.text();

  console.log("Raw AI response text:", text);

  // Optional: parse if it’s JSON
  // const travelplanData = JSON.parse(text);
  // setTripPlan(travelplanData);
} catch (error) {
  console.error("Gemini API Error:", error);
  toast.error("❌ Failed to generate trip. Check quota or key.");
}

  };

  const GetUserProfile=(tokenInfo)=>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers:{
      Authorization: `Bearer ${tokenInfo?.access_token}`, Accept: 'Application/json'}
    }).then((resp)=>{
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
  }

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="text-4xl font-bold">Tell us about your travel preferences 🏕️🌴</h2>
      <p className="text-xl text-gray-600">
        Just provide us with some details about your ideal trip, and we'll create a personalized itinerary just for you.
      </p>

      <div className="mt-20">
        {/* Location */}
        <h2 className="text-2xl font-bold">Where are you planning to go?</h2>
        <div className="my-3 text-lg">
          <select
            className="w-full p-2 border rounded-lg"
            onChange={(e) => handleInputChange("location", e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select a destination
            </option>
            <option value="Manali">Manali</option>
            <option value="Goa">Goa</option>
            <option value="Kerala">Kerala</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Ladakh">Ladakh</option>
          </select>
        </div>

        {/* Days */}
        <h2 className="text-2xl mt-6 font-bold">How many days are you planning the trip?</h2>
        <div className="text-xl my-3 font-medium">
          <Input
            type="number"
            placeholder="Ex. 5"
            onChange={(e) => handleInputChange("days", e.target.value)}
          />
        </div>

        {/* Budget */}
        <h2 className="text-2xl my-3 font-bold">What is your budget for the trip?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`py-1 cursor-pointer space-y-1 px-3 text-xl hover:shadow-2xl hover:bg-gray-50 border rounded-lg ${
                formData.budget === item.title ? "bg-gray-100 border-black" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <h2 className="text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>

        {/* Travelers */}
        <h2 className="text-2xl mt-5 font-bold">Let us know how many travelers you're planning for.</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("travelers", item.people)}
              className={`py-2 cursor-pointer space-y-1 px-3.5 text-xl hover:shadow-2xl hover:bg-gray-50 border rounded-lg ${
                formData.travelers === item.people ? "bg-gray-100 border-black" : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <h2 className="text-xl text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end cursor-pointer my-10">
        <Button onClick={OnGenerateTrip}>Generate Trip</Button>
      </div>



      <Dialog open={openDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Sign in</DialogTitle>
      <DialogDescription>
        Use your Google account to authenticate securely.
      </DialogDescription>
    </DialogHeader>

    <div className="flex flex-col items-center mt-4">
      <img src="/logo.svg" alt="Logo" className="w-12 h-12" />

      <h2 className="font-bold text-lg mt-6 flex gap-2 items-center">
        Sign In with Google
      </h2>

      <p className="text-sm text-muted-foreground mt-2 text-center">
        Sign in to the app with Google authentication securely
      </p>

      <Button onClick={login} className="w-full mt-5 flex gap-2 justify-center items-center">
        <FcGoogle className="h-6 w-6" />
        Sign In with Google
      </Button>
    </div>
  </DialogContent>
</Dialog>



    </div>
  );
}

export default CreateTrip;
