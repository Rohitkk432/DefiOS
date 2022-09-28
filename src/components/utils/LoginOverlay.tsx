import React from 'react'

import {LockClosedIcon} from '@heroicons/react/solid'

interface LoginOverlayProps {
    load: boolean
    onClickConnect: () => void
}

const LoginOverlay: React.FC<LoginOverlayProps> = ({load,onClickConnect}) => {
    return (
        <div className={`w-[80vw] h-screen fixed z-[200] top-0 right-0  
        ${load?'flex':'hidden'} justify-center items-center flex-col`}>
            <div className='absolute top-0 bottom-0 left-0 right-0 backdrop-blur-[0.3vh] bg-[rgba(255,255,255,0.5)]' ></div>
            <button className='flex flex-row items-center justify-center py-[1vh] p-[4vh] text-white bg-purple-500 rounded-[1vh] z-40 border-purple-400 border-2' 
            onClick={onClickConnect} >
                <div className='text-[3.5vh]' >Connect Wallet to Get Started</div>
                <LockClosedIcon className="h-[4vh] ml-[2vh]"/>
            </button>
        </div>
    );
}

export default LoginOverlay;