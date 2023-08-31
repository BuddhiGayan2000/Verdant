import React, { useState } from 'react';
import { motion } from "framer-motion";
import { MdCloudUpload, MdTitle, MdDelete  } from 'react-icons/md';
import { FaTemperatureHigh, FaTemperatureLow } from 'react-icons/fa';
import { WiHumidity } from 'react-icons/wi';
import { GiGroundSprout } from 'react-icons/gi';
import { TbBrandDaysCounter  } from 'react-icons/tb';
import { categories, soilMoistValues } from '../utils/data';
import Loader from './Loader';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase.config';
import { getAllPlants, saveItem } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";


const CreateContainer = () => {

  const [title, setTitle] = useState("");
  const [MAX_TEMP, setMAX_TEMP] = useState("");
  const [MIN_TEMP, setMIN_TEMP] = useState("");
  const [MAX_HU, setMAX_HU] = useState("");
  const [MIN_HU, setMIN_HU] = useState("");
  const [FertFreq, setFertFreq] = useState("");
  const [turnOffHour, setturnOffHour] = useState("");
  const [turnOnHour, setturnOnHour] = useState("");
  const [des, setdes] = useState("");
  const [category, setCategory] = useState(null);
  const [MIN_SO, setMIN_SO] = useState(null);

  const [imageAsset, setImageAsset] = useState(null);
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [{ Plants }, dispatch] = useStateValue();
  
  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
        setFields(true);
        setMsg("Error while uploading : Try AGain 🙇");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageAsset(downloadURL);
          setIsLoading(false);
          setFields(true);
          setMsg("Image uploaded successfully 😊");
          setAlertStatus("success");
          setTimeout(() => {
            setFields(false);
          }, 4000);
        });
      }
    );
  };

  const deleteImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef).then(() => {
      setImageAsset(null);
      setIsLoading(false);
      setFields(true);
      setMsg("Image deleted successfully 😊");
      setAlertStatus("success");
      setTimeout(() => {
        setFields(false);
      }, 4000);
    });
  };

  const saveDetails = () => {
    setIsLoading(true);
    try {

      if((!title || !MAX_TEMP || !MIN_TEMP || !MAX_HU || !MIN_HU || !MIN_SO || !turnOnHour || !turnOffHour || !category || !imageAsset)){
        setFields(true);
        setMsg("Required fields can't be empty");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);

      } else {
        const data = {
          id : `${Date.now()}`,
          title : title,
          MAX_TEMP : Number(MAX_TEMP),
          MIN_TEMP : Number(MIN_TEMP),
          MAX_HU : Number(MAX_HU),
          MIN_HU : Number(MIN_HU),
          FertFreq : Number(FertFreq),
          turnOnHour : Number(turnOnHour),
          turnOffHour : Number(turnOffHour),
          des : des,
          MIN_SO : MIN_SO,
          category : category,
          imageURL : imageAsset,
          qty : 1
        }
        saveItem(data)
        setIsLoading(false);
        setFields(true);
        setMsg("data uploaded successfully 😊");
        setAlertStatus("success");
        setTimeout(() => {
          setFields(false);
      }, 4000);
      clearData();
      }

    } catch (error) {
      console.log(error);
        setFields(true);
        setMsg("Error while uploading : Try AGain 🙇");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
    }

    fetchData();

  };

  const clearData = () => {
    setTitle("");
    setCategory("Select Variety");
    setImageAsset(null);
    setMAX_TEMP("");
    setMIN_TEMP("");
    setMAX_HU("");
    setMIN_HU("");
    setFertFreq("");
    setturnOnHour("");
    setturnOffHour("");
    setMIN_SO("Water the plant when the soil is...");
    setdes("");
  };

  const fetchData = async () => {
    await getAllPlants().then(data => {
      dispatch({
        type : actionType.SET_PLANTS,
        Plants : data,
      });
    });
  };
  

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-ivy bg-no-repeat bg-cover'>

      <div className='w-[90%]  md:w-[75%] border-4 border-lime-700  rounded-lg p-4 flex flex-col items-center justify-center gap-4 backdrop-blur-xl'>
        {fields && (
          <motion.p 
            intitial={{opacity : 0}}
            animate={{opacity : 1}}
            exit={{opacity : 0}}

            className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
              alertStatus === "danger" 
              ? "bg-red-400 text-red-800" 
              : "bg-emerald-400 text-emerald-950"}`}
            >
            {msg}
            
          </motion.p>
        )}

        <div className="w-full py-2 border-b-4 border-gray-800 flex items-center gap-2 bg-white rounded-lg pl-3">
          <MdTitle className="text-x1 text-gray-700" />
          <input 
            type="text" 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Plant Name"
            className="w-full h-full text-lg bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor" /> 
        </div>

        <div className="w-full border-b-4 border-gray-800 rounded-lg">
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
          >
            <option value="other" className="bg-white">
              Select Variety
            </option>
            {categories &&
              categories.map((item) => (
                <option
                  key={item.id}
                  className="text-base border-0 outline-none capitalize bg-white text-headingColor"
                  value={item.urlParamName}
                >
                  {item.name}
                </option>
              ))}
            </select>
        </div>

        <div className="group flex border-2 border-gray-800 justify-center items-center flex-col  border-dotted  w-full h-225 md:h-340 cursor-pointer bg-white rounded-lg">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {!imageAsset ? (
                <>
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                      <p className="text-gray-500 hover:text-gray-700">
                        Click here to upload
                      </p>
                    </div>
                    <input
                      type="file"
                      name="uploadimage"
                      accept="image/*"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative h-full">
                    <img
                      src={imageAsset}
                      alt="uploaded_image"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                      onClick={deleteImage}
                    >
                      <MdDelete className="text-white" />
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="w-full flex flex-col md:flex-col items-center gap-3 bg-white rounded-lg pl-3 border-b-4 border-l-2 border-r-2 border-gray-800">

          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <FaTemperatureHigh className="text-gray-700 text-2xl" />
            <input
              type="number"
              required
              value={MAX_TEMP}
              onChange={(e) => setMAX_TEMP(e.target.value)}
              placeholder="Maximum Temperature (Celsius)"
              className="w-full h-full text-lg bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor"
            />
          </div>

          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <FaTemperatureLow className="text-gray-700 text-2xl" />
            <input
              type="number"
              required
              value={MIN_TEMP}
              onChange={(e) => setMIN_TEMP(e.target.value)}
              placeholder="Minimum Temperature (Celsius)"
              className="w-full h-full text-lg bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor"
            />
          </div>

          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <WiHumidity className="text-gray-700 text-2xl" />
            <input
              type="number"
              required
              value={MAX_HU}
              onChange={(e) => setMAX_HU(e.target.value)}
              placeholder="Maximum Humidity (%)"
              className="w-full h-full text-lg bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor"
            />
          </div>

          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <WiHumidity className="text-gray-700 text-2xl" />
            <input
              type="number"
              required
              value={MIN_HU}
              onChange={(e) => setMIN_HU(e.target.value)}
              placeholder="Minimum Humidity (%)"
              className="w-full h-full text-lg bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor"
            />
          </div>

          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <GiGroundSprout className="text-gray-700 text-2xl" />
            <input
              type="number"
              required
              value={FertFreq}
              onChange={(e) => setFertFreq(e.target.value)}
              placeholder="Fertilizing Frequency (Days)"
              className="w-full h-full text-lg bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor"
            />
          </div>

          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <TbBrandDaysCounter className="text-gray-700 text-2xl" />
            <input
              type="number"
              required
              value={turnOnHour}
              onChange={(e) => setturnOnHour(e.target.value)}
              placeholder="Time to turn on the light (Hour in 24)"
              className="w-full h-full text-lg bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor"
              min="1"
              max="24"
            />
          </div>

          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <TbBrandDaysCounter className="text-gray-700 text-2xl" />
            <input
              type="number"
              required
              value={turnOffHour}
              onChange={(e) => setturnOffHour(e.target.value)}
              placeholder="Time to turn off the light (Hour in 24)"
              className="w-full h-full text-lg bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor"
            />
          </div>

        </div>

        <div className="w-full border-b-4 border-gray-800 rounded-lg">
          <select
            onChange={(e) => setMIN_SO(parseInt(e.target.value, 10)) }
            className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
          >
            <option value="other" className="bg-white">
              Water the plant when the soil is...
            </option>
            {soilMoistValues &&
              soilMoistValues.map((item) => (
                <option
                  key={item.id}
                  className="text-base border-0 outline-none capitalize bg-white text-headingColor"
                  value={item.moist}
                >
                  {item.name}
                </option>
              ))}
            </select>
        </div>

        <div className="w-full h-32 py-2 border-b-4 border-gray-800 flex items-center gap-2 bg-white rounded-lg pl-3">
          <textarea
            value={des}
            onChange={(e) => setdes(e.target.value)}
            placeholder="Description Or Guidlines"
            className="w-full h-full text-sm bg-transparent font-semibold outline-none border-none placeholder:text-gray-400 text-textColor"
          ></textarea >
        </div>


        <div className="flex items-center w-full ">
          <button
            type="button"
            className="ml-0 md:ml-auto w-full md:w-auto border-b-4 border-gray-800 outline-none bg-emerald-500 px-12 py-2 rounded-lg text-lg text-white font-semibold "
            onClick={saveDetails}
          >
            Save
          </button>
        </div>
          
      </div>
    </div>
  );
};

export default CreateContainer;