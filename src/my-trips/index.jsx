import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ← usually the right hook
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";
function MyTrips() {
  const navigate = useNavigate();      // ✅ hook at top level
  const [userTrips, setUserTrips]=useState([]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // redirect if not signed in
    if (!storedUser) {
      navigate("/");                   // ✅ safe to call here
      return;
    }

    // otherwise fetch trips, etc.
    fetchUserTrips(JSON.parse(storedUser));
  }, [navigate]);                      // run once (and if navigate ref changes)

   const fetchUserTrips = async (user) => {
  console.log("fetching trips for", user?.email);
  
  const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
  const querySnapshot = await getDocs(q);
   setUserTrips([]);
  querySnapshot.forEach((doc) => {
    const data = doc.data(); // ✅ get trip data as plain object
    console.log(doc.id, " => ", data);
    setUserTrips(prevVal => [...prevVal, data]);
  });
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 pt-10">
        <h2 className="font-bold text-3xl">
          My Trips
        </h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-5">
          {userTrips.map((trip)=>(
            <UserTripCardItem trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyTrips;
