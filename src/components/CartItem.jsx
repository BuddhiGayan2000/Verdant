import React from "react";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import {firestore, rdb} from '../firebase.config'
import {collection, getDoc , doc } from "firebase/firestore"
import {ref, set} from "firebase/database"
import { Link } from 'react-router-dom';


const CartItem = ({item}) => {

  const [{ user }] = useStateValue();
  console.log('Item ID:', item.id);
  const sendPlantDataToRealtimeDB = async (itemId) => {
    try {
      // Retrieve the plant data from Firestore using the itemId (document ID)
      const docRef = doc(collection(firestore, 'Plants'), itemId);
      const docSnapshot = await getDoc(docRef);
      const plantData = docSnapshot.data();
  
      if (plantData) {
        // Check if 'plantData' is an object
        if (typeof plantData === 'object' && plantData !== null) {
          // Set the plant data in the Realtime Database under the 'plant/' reference
          set(ref(rdb, 'plant/'), {
            ...plantData,
            
          });
          const currentTime = Date.now();
          set(ref(rdb, 'plant/PlantedTime'), currentTime).then(() => {
            console.log('Timestamp saved!');
          })
          .catch((error) => {
            console.error('Error saving timestamp:', error);
          });
  
          console.log('Plant data sent to Realtime Database successfully!');
        } else {
          console.error('Invalid plant data retrieved from Firestore.');
        }
      } else {
        console.log('No plant data found in Firestore with the provided item ID.');
      }
    } catch (error) {
      console.error('Error sending plant data to Realtime Database:', error);
    }
  };
  

  return (
    <div className="w-full p-1 px-2 rounded-lg bg-cartItem flex flex-col items-center gap-2">
      <img
        src={item?.imageURL}
        className="w-full object-contain"
        alt=""
      />

      {/* name section */}
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className=" text-3xl text-gray-50">{item?.title}</p>
        <p className="text-base text-gray-300 font-semibold mt-5 mb-3">
          Category : {item?.category}
        </p>
        <p className=" text-xl text-gray-50 mt-5">Description</p>
        <p className="text-base text-gray-300 font-semibold mt-0 mb-3">
          {item?.des}
        </p>
      </div>
      {user ? (
        <Link to={"/realtimedata"}>
          <motion.button
            whileTap={{ scale: 0.8 }}
            type="button"
            onClick={() => sendPlantDataToRealtimeDB(item.id)}
            className=" w-96 p-2 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-gray-50 text-lg my-2 hover:shadow-lg"
          >
            Plant Now
          </motion.button>
        </Link>
      ) : (
        <motion.button
          whileTap={{ scale: 0.8 }}
          type="button"
          className="w-full p-2 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-gray-50 text-lg my-2 hover:shadow-lg"
        >
          Login to Plant
        </motion.button>
      )}

    </div>
  );
};

export default CartItem;
