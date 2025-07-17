import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import PlacesAutocomplete from "@/components/PlacesAutcomplete";
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
import { useNavigate } from "react-router-dom";

// Import travel images
import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.jpg";
import img4 from "@/assets/4.jpg";
import img5 from "@/assets/5.jpg";

function CreateTrip() {
  const [formData, setFormData] = useState({});
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
    console.log("Generate Trip button clicked!"); // Debug log
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

    console.log("Navigating to generating-trip page..."); // Debug log
    // Navigate to generating page with form data
    try {
      navigate('/generating-trip', {
        state: {
          formData: formData
        }
      });
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
    }
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
        // Dispatch custom event to notify Header component
        window.dispatchEvent(new CustomEvent('userSignIn', { detail: resp.data }));
        setOpenDialog(false);
        OnGenerateTrip();
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 pt-10 pb-20">
        <h2 className="text-4xl font-bold text-center">Tell us about your travel preferences 🎕️🌴</h2>
        
        <p className="text-xl text-gray-600 text-center mt-4">
          Just provide us with some details about your ideal trip, and we'll create a personalized itinerary just for you.
        </p>

        {/* Travel Inspiration Background */}
        <div className="mt-12 mb-16 relative">
          <h3 className="text-2xl font-semibold text-center mb-6 text-gray-700">✨ Get Inspired by Amazing Destinations</h3>
          
          {/* Background Image Mosaic */}
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
            {/* Background Images */}
            <div className="absolute inset-0 grid grid-cols-5 opacity-80">
              <div 
                className="bg-cover bg-center transition-all duration-700 hover:scale-110" 
                style={{backgroundImage: `url(${img1})`}}
              ></div>
              <div 
                className="bg-cover bg-center transition-all duration-700 hover:scale-110" 
                style={{backgroundImage: `url(${img2})`}}
              ></div>
              <div 
                className="bg-cover bg-center transition-all duration-700 hover:scale-110" 
                style={{backgroundImage: `url(${img3})`}}
              ></div>
              <div 
                className="bg-cover bg-center transition-all duration-700 hover:scale-110" 
                style={{backgroundImage: `url(${img4})`}}
              ></div>
              <div 
                className="bg-cover bg-center transition-all duration-700 hover:scale-110" 
                style={{backgroundImage: `url(${img5})`}}
              ></div>
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-8">
              <h2 className="text-4xl font-bold text-center mb-4 drop-shadow-lg">
                Plan Your Perfect Adventure
              </h2>
              <p className="text-xl text-center opacity-90 drop-shadow-md">
                From tropical beaches to mountain peaks - your dream destination awaits
              </p>
              <div className="flex gap-6 mt-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  🏖️ Beaches
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  🏔️ Mountains
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  🏙️ Cities
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  🌲 Nature
                </span>
              </div>
            </div>
          </div>
        </div>

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

        <h2 className="text-2xl my-3 font-bold text-gray-800">What is your budget for the trip?</h2>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
  {SelectBudgetOptions.map((item, index) => (
    <div
      key={index}
      onClick={() => handleInputChange("budget", item.title)}
      className={`cursor-pointer p-5 rounded-2xl border shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400
        ${
          formData.budget === item.title
            ? "bg-gradient-to-br from-indigo-100 via-blue-50 to-teal-100 border-indigo-500 shadow-lg"
            : "bg-white"
        }`}
    >
      <div className="text-4xl mb-2">{item.icon}</div>
      <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
      <p className="text-sm text-gray-500">{item.desc}</p>
    </div>
  ))}
</div>


        <h2 className="text-2xl mt-8 font-bold text-gray-800">
  Let us know how many travelers you're planning for.
</h2>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
  {SelectTravelList.map((item, index) => (
    <div
      key={index}
      onClick={() => handleInputChange("travelers", item.people)}
      className={`cursor-pointer p-5 rounded-2xl border shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400
        ${
          formData.travelers === item.people
            ? "bg-gradient-to-br from-indigo-100 via-blue-50 to-teal-100 border-indigo-500 shadow-lg"
            : "bg-white"
        }`}
    >
      <div className="text-4xl mb-2">{item.icon}</div>
      <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
      <p className="text-sm text-gray-500">{item.desc}</p>
    </div>
  ))}
</div>

      </div>

      <div className="flex justify-end my-10">
        <Button onClick={() => {
          console.log("Button clicked!");
          console.log("Form data:", formData);
          OnGenerateTrip();
        }} className="cursor-pointer">
          Generate Trip
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
              <Button onClick={login} className="w-full mt-5 flex gap-2 justify-center items-center">
                <FcGoogle className="h-6 w-6" /> Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}

export default CreateTrip;