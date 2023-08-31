import React from 'react'
import { motion } from "framer-motion";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";

import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';
import EmptyCart from "../img/emptyCart.svg";
import CartItem from './CartItem';


const CartContainer = () => {

    const [{ cartShow, cartItems}, dispatch] = useStateValue();
    
    const showCart  = () => {
        dispatch({
          type: actionType.SET_CART_SHOW,
          cartShow: !cartShow,
        });
      }

      const clearCart = () => {
        dispatch({
          type: actionType.SET_CARTITEMS,
          cartItems: [],
        });
    
        localStorage.setItem("cartItems", JSON.stringify([]));
      };


  return (
    <motion.div 
    initial={{ opacity: 0, x: 200 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 200 }}
    className="fixed top-0 right-0 w-full md:w-460 h-screen bg-white drop-shadow-md flex flex-col z-[101]">
      <div className="w-full flex items-center justify-between p-4 cursor-pointer">
        <motion.div whileTap={{ scale: 0.75 }} onClick={showCart}>
          <MdOutlineKeyboardBackspace className="text-textColor text-3xl" />
        </motion.div>
        <p className="text-textColor text-lg font-semibold">Plant Details</p>

        <motion.p
          whileTap={{ scale: 0.75 }} onClick={clearCart}
          className="flex items-center gap-2 p-1 px-2 my-2 bg-gray-100 rounded-md hover:shadow-md  cursor-pointer text-textColor text-base"
        >
          Clear <RiRefreshFill />
        </motion.p>
      </div>
      {/* bottom section */}
      {cartItems && cartItems.length > 0 ? (
      <div className="w-full h-full bg-cartBg rounded-t-[2rem] flex flex-col">
        {/* cart Items section */}
        <div className="w-full h-[620px] md:h-42 px-6 py-10 flex flex-col gap-3 overflow-y-scroll scrollbar-none bg-cartItem">
            {/* cart Item */}
            {cartItems && cartItems.map(item => (
                <CartItem 
                    key={item.id}
                    item={item}
                />
            ))}
        </div>

      </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
          <img src={EmptyCart} className="w-300" alt="" />
          <p className="text-xl text-textColor font-semibold">
            Select a plant to view details
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CartContainer