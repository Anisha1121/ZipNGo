import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import PlacesAutocomplete from "@/components/PlacesAutcomplete";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  Sparkles, 
  CheckCircle, 
  Circle,
  Plane,
  Camera,
  Mountain,
  Sun,
  Star,
  Heart,
  ArrowRight,
  Clock,
  Globe
} from "lucide-react";
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
  
  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const fields = ['location', 'days', 'travelDate', 'budget', 'travelers'];
    const completedFields = fields.filter(field => formData[field]).length;
    return (completedFields / fields.length) * 100;
  };

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

    if (!formData?.location || !formData?.days || !formData?.budget || !formData?.travelers || !formData?.travelDate) {
      toast.error("❌ Please fill all details", {
        description: "Location, days, travel date, budget, and travelers are required",
        duration: 4000,
      });
      return;
    }

    if (formData?.days > 10) {
      toast.error("❌ Trip duration too long", {
        description: "Trip duration must be 10 days or less",
        duration: 4000,
      });
      return;
    }

    // Validate travel date again
    const selectedDate = new Date(formData.travelDate);
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(currentDate.getMonth() + 4);
    
    if (selectedDate < currentDate || selectedDate > maxDate) {
      toast.error("❌ Invalid travel date", {
        description: "Please select a valid date within the next 4 months",
        duration: 4000,
      });
      return;
    }

    console.log("Navigating to generating-trip page..."); // Debug log
    
    toast.success("🎉 Creating your perfect trip!", {
      description: "Please wait while we generate your personalized itinerary",
      duration: 3000,
    });
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 pt-10 pb-20">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          
          
          <h1 className="text-5xl font-bold mt-10">
            Tell us about your travel preferences🌴
          </h1>
          <br />
          

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Just provide us with some details about your ideal trip, and we'll create a personalized itinerary just for you ✨
          </p>


          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                <AnimatedCounter end={150} suffix="+" />
              </div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                <AnimatedCounter end={50000} suffix="+" />
              </div>
              <div className="text-sm text-gray-600">Happy Travelers</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                <AnimatedCounter end={2} suffix=" min" />
              </div>
              <div className="text-sm text-gray-600">Average Planning</div>
            </div>
          </div>
        </div>

        {/* Travel Inspiration Background - Enhanced */}
        <div className="mt-12 mb-16 relative">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">✨ Get Inspired by Amazing Destinations</h3>
            <p className="text-gray-600">Discover breathtaking places around the world</p>
          </div>
          
          {/* Enhanced Background Image Mosaic */}
          <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl group">
            {/* Background Images with better layout */}
            <div className="absolute inset-0 grid grid-cols-5 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
              {[img1, img2, img3, img4, img5].map((img, index) => (
                <div 
                  key={index}
                  className={`bg-cover bg-center transition-all duration-700 hover:scale-110 cursor-pointer relative ${
                    index === 2 ? 'transform scale-105 z-10' : ''
                  }`}
                  style={{backgroundImage: `url(${img})`}}
                >
                  <div className="absolute inset-0 bg-black/30 hover:bg-black/20 transition-colors duration-300"></div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>
            
            {/* Enhanced Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-8">
              <div className="text-center">
                <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">
                  Plan Your Perfect Adventure
                </h2>
                <p className="text-xl opacity-90 drop-shadow-md max-w-2xl mx-auto mb-8">
                  From tropical beaches to mountain peaks - your dream destination awaits
                </p>
                
                {/* Enhanced Category Tags */}
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { icon: "🏖️", label: "Beaches", color: "from-blue-500/30 to-cyan-500/30" },
                    { icon: "🏔️", label: "Mountains", color: "from-gray-500/30 to-slate-600/30" },
                    { icon: "🏙️", label: "Cities", color: "from-purple-500/30 to-pink-500/30" },
                    { icon: "🌲", label: "Nature", color: "from-green-500/30 to-emerald-500/30" }
                  ].map((category, index) => (
                    <span 
                      key={index}
                      className={`px-6 py-3 bg-gradient-to-r ${category.color} backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 hover:scale-105 transition-transform duration-300 cursor-pointer`}
                    >
                      {category.icon} {category.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Steps Container */}
        <div className="space-y-12">
          {/* Helpful Tips Section */}
          {getCompletionPercentage() > 0 && getCompletionPercentage() < 100 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                <h3 className="text-lg font-semibold text-blue-800">Quick Tips</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Plan Ahead</p>
                    <p className="text-xs text-blue-600">Book 2-3 months in advance for better deals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Best Experience</p>
                    <p className="text-xs text-green-600">Mix popular attractions with local hidden gems</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Destination */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                formData.location ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
              } shadow-lg`}>
                {formData.location ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <MapPin className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Where are you planning to go?</h2>
                <p className="text-gray-600">Choose your dream destination</p>
              </div>
            </div>
            
            <div className="relative">
              <PlacesAutocomplete
                onSelect={(city) => {
                  handleInputChange("location", city.place_name);
                  toast.success("📍 Destination selected!", {
                    description: `Planning trip to ${city.place_name}`,
                    duration: 3000,
                  });
                }}
              />
              {formData.location && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">Destination: {formData.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Duration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                formData.days ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-violet-600'
              } shadow-lg`}>
                {formData.days ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Calendar className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">How many days are you planning the trip?</h2>
                <p className="text-gray-600">Set your adventure duration (max 10 days)</p>
              </div>
            </div>
            
            <div className="relative">
              <Input
                type="number"
                placeholder="Ex. 5"
                onChange={(e) => {
                  const days = e.target.value;
                  if (days > 10) {
                    toast.error("❌ Too many days", {
                      description: "Maximum trip duration is 10 days",
                      duration: 4000,
                    });
                    return;
                  }
                  handleInputChange("days", days);
                  if (days && days <= 10) {
                    toast.success("📅 Trip duration set!", {
                      description: `Planning a ${days} day adventure`,
                      duration: 3000,
                    });
                  }
                }}
                value={formData.days || ""}
                min="1"
                max="10"
                className="text-xl font-medium bg-gradient-to-r from-indigo-50 via-blue-50 to-teal-50 border-2 border-transparent hover:border-indigo-300 focus:border-indigo-500 focus:bg-white transition-all duration-300 rounded-xl px-6 py-4 shadow-sm hover:shadow-md"
              />
              {formData.days && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">Duration: {formData.days} days</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Travel Date */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                formData.travelDate ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-yellow-600'
              } shadow-lg`}>
                {formData.travelDate ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">When are you planning to travel?</h2>
                <p className="text-gray-600">Select your departure date</p>
              </div>
            </div>
            
            <div className="relative">
              <Input
                type="date"
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  const currentDate = new Date();
                  const maxDate = new Date();
                  maxDate.setMonth(currentDate.getMonth() + 4);
                  
                  if (selectedDate < currentDate) {
                    toast.error("❌ Travel date cannot be in the past", {
                      description: "Please select a future date for your trip",
                      duration: 4000,
                    });
                    return;
                  }
                  
                  if (selectedDate > maxDate) {
                    toast.error("❌ Invalid date selected", {
                      description: "You can only plan trips up to 4 months in advance",
                      duration: 4000,
                    });
                    return;
                  }
                  
                  handleInputChange("travelDate", e.target.value);
                  toast.success("✅ Travel date set!", {
                    description: `Your trip is planned for ${selectedDate.toLocaleDateString()}`,
                    duration: 3000,
                  });
                }}
                value={formData.travelDate || ""}
                min={new Date().toISOString().split('T')[0]}
                max={(() => {
                  const maxDate = new Date();
                  maxDate.setMonth(maxDate.getMonth() + 4);
                  return maxDate.toISOString().split('T')[0];
                })()}
                className="text-xl font-medium bg-gradient-to-r from-indigo-50 via-blue-50 to-teal-50 border-2 border-transparent hover:border-indigo-300 focus:border-indigo-500 focus:bg-white transition-all duration-300 rounded-xl px-6 py-4 shadow-sm hover:shadow-md"
              />
              <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select a date within the next 4 months
              </p>
              {formData.travelDate && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <Sun className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Travel Date: {new Date(formData.travelDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Budget */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                formData.budget ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
              } shadow-lg`}>
                {formData.budget ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Wallet className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">What is your budget for the trip?</h2>
                <p className="text-gray-600">Choose a budget range that suits you</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    handleInputChange("budget", item.title);
                    toast.success("💰 Budget selected!", {
                      description: `${item.title} budget plan chosen`,
                      duration: 3000,
                    });
                  }}
                  className={`cursor-pointer p-6 rounded-2xl border-2 shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-indigo-400 group
                    ${
                      formData.budget === item.title
                        ? "bg-gradient-to-br from-indigo-100 via-blue-50 to-teal-100 border-indigo-500 shadow-lg transform -translate-y-1 scale-105"
                        : "bg-white border-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50"
                    }`}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  {formData.budget === item.title && (
                    <div className="mt-3 flex items-center gap-2 text-indigo-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 5: Travelers */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                formData.travelers ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-cyan-600'
              } shadow-lg`}>
                {formData.travelers ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Users className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">How many travelers are you planning for?</h2>
                <p className="text-gray-600">Tell us about your travel companions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {SelectTravelList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    handleInputChange("travelers", item.people);
                    toast.success("👥 Travelers selected!", {
                      description: `Planning for ${item.people} - ${item.title}`,
                      duration: 3000,
                    });
                  }}
                  className={`cursor-pointer p-6 rounded-2xl border-2 shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-indigo-400 group
                    ${
                      formData.travelers === item.people
                        ? "bg-gradient-to-br from-indigo-100 via-blue-50 to-teal-100 border-indigo-500 shadow-lg transform -translate-y-1 scale-105"
                        : "bg-white border-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50"
                    }`}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  {formData.travelers === item.people && (
                    <div className="mt-3 flex items-center gap-2 text-indigo-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Generate Button */}
        <div className="flex justify-center mt-16">
          <div className="text-center">
            {getCompletionPercentage() === 100 && (
              <div className="mb-6 animate-bounce">
                <div className="bg-green-100 border border-green-300 rounded-full p-4 inline-flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-800 font-semibold">All details completed! Ready to generate your trip ✨</span>
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => {
                console.log("Button clicked!");
                console.log("Form data:", formData);
                OnGenerateTrip();
              }} 
              className={`cursor-pointer bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 hover:from-indigo-700 hover:via-blue-700 hover:to-teal-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-xl group btn-magnetic ${
                !formData?.location || !formData?.days || !formData?.travelDate || !formData?.budget || !formData?.travelers
                  ? 'opacity-50 cursor-not-allowed'
                  : 'animate-pulse hover:animate-none'
              }`}
              disabled={!formData?.location || !formData?.days || !formData?.travelDate || !formData?.budget || !formData?.travelers}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Generate My Perfect Trip</span>
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </Button>
            
            <p className="text-gray-500 mt-4 text-sm">
              🔒 Your data is secure and will only be used to create your personalized itinerary
            </p>
          </div>
        </div>

        {/* Floating Help Widget */}
        {getCompletionPercentage() < 100 && (
          <div className="fixed bottom-8 right-8 z-50">
            <div className="bg-white shadow-2xl rounded-full p-4 border border-gray-200 hover:shadow-3xl transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="hidden group-hover:block animate-in slide-in-from-right-2 duration-300">
                  <p className="text-sm font-medium text-gray-800">Need help?</p>
                  <p className="text-xs text-gray-600">Complete all fields to continue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Sign-in Dialog */}
        <Dialog open={openDialog}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-800">Welcome to ZipNGo!</DialogTitle>
              <DialogDescription>
                <div className="space-y-4 mt-4">
                  <img src="/logo.svg" alt="Logo" className="w-16 h-16 mx-auto" />
                  <h2 className="font-bold text-xl text-gray-800 flex gap-2 items-center justify-center">
                    <FcGoogle className="w-6 h-6" />
                    Sign In with Google
                  </h2>
                  <p className="text-sm text-gray-600 text-center max-w-sm mx-auto">
                    Sign in securely with your Google account to save your trips and access personalized recommendations
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-800">Join thousands of happy travelers!</p>
                  </div>
                  <Button 
                    onClick={login} 
                    className="w-full mt-6 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-300 py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex gap-3 justify-center items-center font-semibold"
                  >
                    <FcGoogle className="h-6 w-6" /> 
                    <span>Continue with Google</span>
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    🔒 Your privacy is protected. We only use your email to save your trips.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CreateTrip;