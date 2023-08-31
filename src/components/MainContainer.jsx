import React, { useEffect, useRef, useState } from 'react'
import HomeContainer from './HomeContainer';
import { useStateValue } from '../context/StateProvider';
import MenuContainer from './MenuContainer';
import CartContainer from './CartContainer';


const MainContainer = () => {
  const [{ Plants, cartShow }, dispatch] = useStateValue();
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {}, [scrollValue]);

  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>
      <HomeContainer/> 
      <MenuContainer/>

      {cartShow && (
        <CartContainer/>
      )}

    </div>
  );
};

export default MainContainer;