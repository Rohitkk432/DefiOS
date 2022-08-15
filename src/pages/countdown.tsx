import React from "react";

// import Countdown from "react-countdown-now";


import Soontimer from "../appfiles/Soontimer";
import Canvas from '../components/Canvas';
import config from '../config/index.json';


export default function Album() {

// @ts-ignore 
  // const renderer = ({ days, hours, minutes, seconds }) => {
  //   return (
  //     <strong>
  //     {days}:{hours}:{minutes}:{seconds}
  //     </strong>
  //   );
  // };
  

const { company } = config;
const { biglogo } = company;

  return (
    <React.Fragment>
      <main>
      <div className='grid place-items-center h-screen'>
        <img alt="logo" className="" src={biglogo} />
      
        <div className=" text-3xl mt-10 mx-auto font-extrabold text-center">
          congrats! you are here early! 🎉 
        </div>
        <div className="flex text-3xl mt-5 mx-auto font-extrabold text-center text-primary">
              {/* <Countdown date={Date.now() + 1336423968} renderer={renderer} />  */}
             
              <Soontimer />
              
        </div>
        <div>
          <Canvas />
        </div>
      </div>
      </main>
    </React.Fragment>
  );
}


