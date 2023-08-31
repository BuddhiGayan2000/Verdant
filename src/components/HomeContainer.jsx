import React from 'react'
import HomeBg from '../img/heroBg.png'
import { heropData } from '../utils/data';



const HomeContainer = () => {
  return (
    <section className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full' id="home">
      <div className="py-2 flex-1 flex flex-col items-start md:items-start justify-start gap-6">
        <p className="text-[2.5rem] lg:text-[4rem] font-bold tracking-wide text-headingColor">
          Embrace the <span className="text-green-500 lg:text-[4.5rem]"> Tranquility </span>: Grow with <span className="text-green-500 lg:text-[5rem]">Verdant</span>
        </p>

        <p className="text-base text-textColor text-center md:text-left md:w-[80%]">
        Experience the wonders of indoor gardening with our state-of-art automated grow box. Whether you're a seasoned plant enthusiast or just starting out, our system is designed to provide the perfect environment for your valuable plant to thrive.With precise control over temperature, humidity, soil moisture and light intensity you can give the ideal condition for a wide range of plants.
        </p>

        <button 
          type="button" 
          className=" bg-gradient-to-br text-xl from-lime-400 to-green-500 w-full px-4 py-2 rounded-lg transition-all ease-in-out duration-100 md:w-auto font-semibold">P l a n t</button>
      </div>
      
      <div className="py-2 flex-1 flex items-center relative">
          <img 
            src={HomeBg} 
            alt="home-bg" 
            className=" ml-auto h-420 md:h-600 w-full lg:w-auto lg:h-650"/>

          <div className="w-full h-full absolute top-0 left-0 text-center flex items-center justify-center lg:px-32 py-12 pb-32 lg:gap-x-4 lg:gap-y-[0px] md:gap-4 gap-8 flex-wrap">
            {heropData &&
              heropData.map((n) => (
              <div
                key={n.id}
                className=" md:w-190 w-190 lg:w-190 lg:h-220 h-220 md:h-220 p-4 bg-cardOverlay backdrop-blur-md rounded-3xl flex flex-col items-center justify-center drop-shadow-lg"
              >
                <img
                  src={n.imageSrc}
                  className="h-40 w-40 lg:w-40 lg:h-40 md:w-40 md:h-40 -mt-10 lg:-mt-20  rounded-3xl drop-shadow-2xl"
                  alt="I1"
                />
                <p className="text-base lg:text-base font-semibold text-textColor mt-2 lg:mt-4">
                  {n.name}
                </p>
            </div>
            ))}
          </div>
      </div>
    </section>
  );
};

export default HomeContainer;