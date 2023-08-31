import React, { useEffect, useRef, useState } from "react";
import { PiPottedPlantFill } from "react-icons/pi";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import NotFound from '../img/NotFound.svg'

const RowContainer = ({ flag, data, scrollValue, ref }) => {
  const rowContainer = useRef();

  const [items, setItems] = useState([]);

  const [{ cartItems }, dispatch] = useStateValue();

  const addtocart = () => {
    dispatch({
      type: actionType.SET_CARTITEMS,
      cartItems: items,
    });
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  useEffect(() => {
    rowContainer.current.scrollLeft += scrollValue;
  }, [scrollValue]);

  useEffect(() => {
    addtocart()
  }, [items])

  return (
    <div
      ref={rowContainer}
      className={`w-full flex items-center gap-3  my-12 scroll-smooth  ${
        flag
          ? "overflow-x-scroll scrollbar-none"
          : "overflow-x-hidden flex-wrap justify-center"
      }`}
    >
      {data && data.length > 0 ? (
        data.map((item) => (
          <div
            key={item?.id}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-cardOverlay rounded-lg py-2 px-4  my-12 backdrop-blur-2xl hover:drop-shadow-xl flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className=" w-40 h-40 -mt-12 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src={item?.imageURL}
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-16 h-16 rounded-3xl bg-green-400 hover:bg-green-700 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8 text-3xl"
                onClick={() => setItems([...cartItems, item])}
              >
                <PiPottedPlantFill className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end">
              <p className="text-textColor font-semibold text-base md:text-lg">
                {item?.title}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
        <img src={NotFound} className="h-340" />
        <p className="text-xl text-headingColor font-semibold my-2">
          Items Not Available
        </p>
      </div>
      )}
    </div>
  );
};

export default RowContainer;
