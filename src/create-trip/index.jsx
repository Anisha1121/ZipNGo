import React, {useState} from 'react'
import { Input } from '@/components/ui/input'
import { SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from "sonner";
import { AI_PROMPT } from '@/constants/options';

function CreateTrip() {

 const [formData, setFormData] = useState({});


const handleInputChange =(name, value)   => {
    setFormData({
      ...formData,
      [name]: value
    });
    console.log(formData);
  };

  useEffect(() => {
    console.log('Form Data Updated:', formData);
  }, [formData])

   const OnGenerateTrip=() => {

    if ((formData?.days) > 10) {
    console.log('Invalid: Please select a trip duration of 10 days or less.');
    return;
  }
    // Handle the trip generation logic here
    if (formData?.days>10 && !formData?.budget || !formData?.location|| !formData?.travelers) {
      toast("Please fill all details")
       return
    }
  const FINAL_PROMPT = AI_PROMPT
  .replace('{location}', formData?.location)
  .replace('{totaldays}', formData?.days)
  .replace('{traveler}', formData?.travelers)
  .replace('{budget}', formData?.budget);

    console.log(FINAL_PROMPT);
  }


  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='text-4xl font-bold'>Tell us about your travel preferences 🏕️🌴</h2>

      <p className=' text-xl text-gray-600'>Just provide us with some details about your ideal trip, and we'll create a personalized itinerary just for you.</p>

      <div className='mt-20'> 
        <div>
          
          <h2 className='text-2xl font-bold'>Where are you planning to go?</h2>
          </div>

          <div className="my-3 text-lg">
  <select
    className="w-full p-2 border rounded-lg"
    onChange={(e) => handleInputChange('location', e.target.value)}
    defaultValue=""
  >
    <option value="" disabled>Select a destination</option>
    <option value="Manali">Manali</option>
    <option value="Goa">Goa</option>
    <option value="Kerala">Kerala</option>
    <option value="Jaipur">Jaipur</option>
    <option value="Ladakh">Ladakh</option>
  </select>
</div>


          <div>        
          
          <h2 className='text-2xl mt-6 font-bold'>How many days are you planning the trip?</h2>

<div className="text-xl my-3 font-medium">
  <Input
    type="number"
    placeholder="Ex. 5"
    onChange={(e) => handleInputChange('days', e.target.value)}
    />
</div>
</div>


           <div>
             <h2 className='text-2xl my-3 font-bold'>What is your budget for the trip?</h2>
             <div className="grid grid-cols-3 gap-5 mt-5">
              {SelectBudgetOptions.map((item, index) => (
              <div key={index} 
              onClick={() => handleInputChange('budget', item.title)}
              className={`py-1 cursor-pointer space-y-1 px-3 text-xl hover:shadow-2xl hover: bg-gray-50 border rounded-lg 
              ${formData.budget === item.title ? 'bg-gray-100 border-black' : ''}
              `} >
              
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className='font-bold'>{item.title}</h2>
                <h2 className="text-gray-500">{item.desc}</h2>


             </div>
              ))}
           </div>
            </div>

 <div>
          <h2 className='text-2xl mt-5 font-bold'>Let us know how many travelers you're planning for.</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item, index) => (
              <div key={index} onClick={() => handleInputChange('travelers', item.people)} className={`py-2 cursor-pointer space-y-1 px-3.5 text-xl hover:shadow-2xl hover: bg-gray-50 border rounded-lg 
                ${formData.travelers === item.people ? 'bg-gray-100 border-black' : ''}
              `}
             
              >
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold'>{item.title}</h2>
                <h2 className='text-xl text-gray-500'>{item.desc}</h2>

                </div>
              
              ))}
              </div>

              
          </div> 



          
    </div>
    <div className=" flex justify-end cursor-pointer my-10 ">
    <Button onClick={OnGenerateTrip} >
          Generate Trip
        </Button>
        </div>

    </div>
  )
}

export default CreateTrip
