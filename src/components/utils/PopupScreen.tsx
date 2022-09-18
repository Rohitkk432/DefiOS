import React from 'react'
import {XIcon} from '@heroicons/react/outline'

interface PopupScreenProps {
    load : boolean;
    setLoad : React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupScreen: React.FC<PopupScreenProps> = ({load,setLoad}) => {
    return (
        <div className={`w-screen h-screen fixed z-[200] top-0 left-0 bg-[rgba(0,0,0,0.6)] 
        ${load?'flex':'hidden'} justify-center items-center flex-col`}>
            <div className='bg-[#4F5A7B] w-[35%] h-[45vh] rounded-[3vh] flex flex-col items-center justify-center relative'>
                <XIcon onClick={()=>{
                    setLoad(false)
                }} className='w-[5vh] h-[5vh] text-[#CDCDCD] absolute top-[2vh] right-[2vh]' />
                <div className='text-white text-[3vh] mt-[1vh]'>Coming Soon</div>
            </div>
        </div>
    );
}

export default PopupScreen;