import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import locPin from "../assets/locPin.json";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AI_PROMPT } from "@/constants/options";
import { toast } from "sonner";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function GeneratingTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    async function generateTrip() {
      try {
        const { formData } = location.state || {};
        
        if (!formData) {
          toast.error("No trip data found. Please try again.");
          navigate('/create-trip');
          return;
        }

        const FINAL_PROMPT = AI_PROMPT
          .replace("{location}", formData.location)
          .replace("{totaldays}", formData.days)
          .replace("{traveler}", formData.travelers)
          .replace("{budget}", formData.budget) +
          "\n\nRespond ONLY with a valid JSON object. Do NOT include markdown or explanation.";

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
        
        // Save trip
        const user = JSON.parse(localStorage.getItem("user"));
        const docId = Date.now().toString();
        await setDoc(doc(db, "AITrips", docId), {
          userSelection: formData,
          tripData: parsedData,
          userEmail: user?.email,
          id: docId
        });

        // Navigate to trip view
        navigate(`/view-trip/${docId}`);
      } catch (error) {
        console.error("Trip generation error:", error);
        toast.error("❌ Failed to generate trip. Please try again.");
        navigate('/create-trip');
      }
    }

    generateTrip();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Lottie animationData={locPin} style={{ width: 500, height: 320 }} />
      <h2 className="text-2xl font-bold mt-8 text-blue-600">Generating your trip...</h2>
      <p className="text-lg text-gray-500 mt-2">Sit tight! Your personalized itinerary is on the way.</p>
    </div>
  );
}

export default GeneratingTrip;
