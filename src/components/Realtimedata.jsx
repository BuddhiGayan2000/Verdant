import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { rdb } from '../firebase.config';
import {PiWarningOctagonFill} from 'react-icons/pi'

const Realtimedata = () => {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [waterLevel, setWaterLevel] = useState('');
  const [fertLevel, setfertLevel] = useState('');
  const [soilMoisture, setsoilMoisture] = useState('');

  useEffect(() => {
    // Listen for changes to the 'plant/' reference in the RTDB
    const temperatureRef = ref(rdb, 'plant/temperature');
    const humidityRef = ref(rdb, 'plant/humidity');
    const waterLevelRef = ref(rdb, 'plant/waterLevel');
    const fertLevelRef = ref(rdb, 'plant/fertLevel');
    const soilMoistureRef = ref(rdb, 'plant/soilMoisture');

    // Use onValue to update the state whenever the data changes
    onValue(temperatureRef, (snapshot) => {
      const temperatureData = snapshot.val();
      setTemperature(temperatureData);
    });

    onValue(humidityRef, (snapshot) => {
      const humidityData = snapshot.val();
      setHumidity(humidityData);
    });

    onValue(waterLevelRef, (snapshot) => {
      const waterLevelData = snapshot.val();
      setWaterLevel(waterLevelData);
    });
    onValue(fertLevelRef, (snapshot) => {
        const fertLevelData = snapshot.val();
        setfertLevel(fertLevelData);
      });

    onValue(soilMoistureRef, (snapshot) => {
      const soilMoistureData = snapshot.val();
      setsoilMoisture(soilMoistureData);
    });
  }, []);

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className=' text-blue-700 text-5xl font-bold italic m-5'>Realtime Data</h1>
      <p className="w-full md:w-[800px] font-bold rounded-2xl m-3 flex flex-col items-center justify-center bg-gradient-to-t from-lime-200 to-lime-500 backdrop-blur-xl text-lg shadow-xl p-5">Temperature :<span className='text-3xl'>{temperature}°C</span></p>
      <p className="w-full md:w-[800px] font-bold rounded-2xl m-3 flex flex-col items-center justify-center bg-gradient-to-t from-lime-200 to-lime-500 backdrop-blur-xl text-lg shadow-xl p-5">Humidity : <span className='text-3xl'>78.5%</span></p>
      {
        waterLevel === 1 && (
          <p className="w-full md:w-[800px] font-bold rounded-2xl m-3 flex flex-col items-center justify-center bg-gradient-to-t from-lime-200 to-lime-500 backdrop-blur-xl text-lg shadow-xl p-5">Water tank status: <span className='text-3xl'>OK</span></p>
        )
      }
      

      {waterLevel === 0 && (
        <p className="w-full md:w-[800px] font-bold rounded-2xl m-3 flex flex-col items-center justify-center bg-red-500 backdrop-blur-xl text-2xl shadow-xl p-5">
          <PiWarningOctagonFill className=" text-7xl"/>Warning: Water level is critically low!
        </p>
      )}
      <p className="w-full md:w-[800px] font-bold rounded-2xl m-3 flex flex-col items-center justify-center bg-gradient-to-t from-lime-200 to-lime-500 backdrop-blur-xl text-lg shadow-xl p-5">Soil Moisture Value : <span className='text-3xl'>636</span></p>
    </div>
  );
};

export default Realtimedata;
