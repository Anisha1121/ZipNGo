import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";
import ResetAccount from "@/components/custom/ResetAccount";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserTrips = useCallback(async (user) => {
    if (!user?.email) return;
    
    console.log("fetching trips for", user?.email);
    setLoading(true);
    
    try {
      const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
      const querySnapshot = await getDocs(q);
      
      const trips = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(doc.id, " => ", data);
        trips.push(data);
      });
      
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setUserTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // redirect if not signed in
    if (!storedUser) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchUserTrips(userData);
  }, [navigate, fetchUserTrips]);

  const handleAccountReset = useCallback(() => {
    // Refresh the trips after account reset
    setUserTrips([]);
    if (user) {
      fetchUserTrips(user);
    }
  }, [user, fetchUserTrips]);

  const handleRefresh = () => {
    if (user) {
      fetchUserTrips(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 pt-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-bold text-3xl text-gray-800 mb-2">
              My Trips
            </h2>
            <p className="text-gray-600">
              {userTrips.length === 0 
                ? "No trips yet. Create your first adventure!" 
                : `You have ${userTrips.length} trip${userTrips.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              onClick={() => navigate('/create-trip')}
              className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Trip
            </Button>
            
            {user && (
              <ResetAccount 
                user={user} 
                onAccountReset={handleAccountReset}
              />
            )}
          </div>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading your trips...</p>
            </div>
          </div>
        ) : userTrips.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No trips found
            </h3>
            <p className="text-gray-600 mb-6">
              Start planning your next adventure by creating your first trip!
            </p>
            <Button
              onClick={() => navigate('/create-trip')}
              className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTrips.map((trip, index) => (
              <UserTripCardItem key={trip.id || index} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;
