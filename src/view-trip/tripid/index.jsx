import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom';
import{ doc, getDoc } from 'firebase/firestore'
import { db } from '@/service/firebaseConfig';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function ViewTrip() {
 const { tripId } = useParams();
 
 const [trip, setTrip] = useState([]);

const GetTripdata = useCallback(async()=>{
  const docRef=doc(db, 'AITrips',tripId);
  const docSnap=await getDoc (docRef);
  if(docSnap.exists())
  {
    console.log("Document:", docSnap.data());
    setTrip(docSnap.data());
  }
  else{
    console.log("No such Document");
    toast('No Trip Found')
  }
}, [tripId])

 useEffect(()=>{
    tripId && GetTripdata();
  }, [tripId, GetTripdata])
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
     {/* INFORMATION SECTION */}
     <InfoSection trip = {trip}/>

     {/* RECOMMENDED HOTELS */}
     <Hotels trip = {trip}/>

     {/* DAILY PLAN */}
     <PlacesToVisit trip = {trip}/>

     {/* FOOTER */}
     <Footer trip={trip}/>


      </div>
    </div>
  );
}

export default ViewTrip
