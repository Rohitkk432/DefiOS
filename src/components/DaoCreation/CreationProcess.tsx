import React from 'react'
import {useState,useEffect} from 'react'

import {CheckIcon} from '@heroicons/react/outline'

import { useSession } from "next-auth/react";

interface CreationProcessProps {
    creationStarter: boolean;
}

const CreationProcess: React.FC<CreationProcessProps> = ({creationStarter}) => {

    const {data:session} = useSession()

    const [processStep, setProcessStep] = useState(0)

    const process1 = async () => {
        const github_uid = session?.user?.image?.split('/')[4]?.split("?")[0] 
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "pub_key": localStorage.getItem('currentAccount'),
                    "github_uid": github_uid,
                    "github_access_token": session?.accessToken
                }
            )
        };
        fetch('https://names.defi-os.com/encrypt',requestOptions)
        .then(res=>res.json())
        .then(res=>res.status===200?setProcessStep(1):console.log(res))
    }

    useEffect(() => {
        if(session && creationStarter && processStep === 0){
            process1();
        }
    } ,[creationStarter,processStep])

    return (
        <div 
        className='w-[19.5%] min-h-[42.2%] h-auto bg-[#121418] rounded-2xl text-white flex flex-col items-start justify-start pt-[1.5%] shadow-[0_0_4vh_0.5vh] shadow-gray-500/70'
        >   
            {/* completed */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center ${(processStep>=1)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===0)?null:'border border-[#727272] border-dashed'} `}>
                    {
                        (processStep>=1) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===0) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=1)?'text-[#A7B9FC]':(processStep===0)?'text-white':'text-[#727272]'} w-[70%]`}>
                    Verifying connection of github username with public key 
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=1)?'border-r border-solid border-[#A7B9FC]':'border-r border-dashed border-[#727272]'}`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center ${(processStep>=2)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===1)?null:'border border-[#727272] border-dashed'} `}>
                    {
                        (processStep>=2) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===1) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=2)?'text-[#A7B9FC]':(processStep===1)?'text-white':'text-[#727272]'} w-[70%]`}>
                    <div>Calling create_dao on</div>
                    <a href={`https://neonscan.org/address/${process.env.DEFIOS_CONTRACT_ADDRESS}`} target="_blank" className='underline text-[#99DCF7]' >
                        {process.env.DEFIOS_CONTRACT_ADDRESS?.slice(0,5)+"..."+process.env.DEFIOS_CONTRACT_ADDRESS?.slice(37,42)}
                    </a>
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=2)?'border-r border-solid border-[#A7B9FC]':'border-r border-dashed border-[#727272]'}`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center ${(processStep>=3)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===2)?null:'border border-[#727272] border-dashed'}`}>
                    {
                        (processStep>=3) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===2) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=3)?'text-[#A7B9FC]':(processStep===2)?'text-white':'text-[#727272]'} w-[70%]`}>
                    Deploying DAO 
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=3)?'border-r border-solid border-[#A7B9FC]':'border-r border-dashed border-[#727272]'}`}></div>

            {/* processing */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center  
                ${(processStep>=4)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===3)?null:'border border-[#727272] border-dashed'} `}>

                    {/* loading spinner */}
                    {
                        (processStep>=4) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===3) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                    
                </div>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=4)?'text-[#A7B9FC]':(processStep===3)?'text-white':'text-[#727272]'} w-[70%]`}>
                    Deploying Contract for token
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=4)?'border-r border-solid border-[#A7B9FC]':'border-r border-dashed border-[#727272]'}`}></div>

            {/* remaining */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center  
                ${(processStep>=5)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===4)?null:'border border-[#727272] border-dashed'} `}>
                    {
                        (processStep>=5) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===4) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=5)?'text-[#A7B9FC]':(processStep===4)?'text-white':'text-[#727272]'} w-[70%]`}>
                    Setting initial token distribution
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=5)?'border-r border-solid border-[#A7B9FC]':(processStep===4)?null:'border-r border-dashed border-[#727272]'}`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center 
                ${(processStep>=6)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===5)?null:'border border-[#727272] border-dashed'} `}>
                    {
                        (processStep>=6) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===5) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=6)?'text-[#A7B9FC]':(processStep===5)?'text-white':'text-[#727272]'} w-[70%]`}>
                    <div>Completing call back to</div>
                    <a href={`https://neonscan.org/address/${process.env.DEFIOS_CONTRACT_ADDRESS}`} target="_blank" className='underline text-[#99DCF7]' >
                        {process.env.DEFIOS_CONTRACT_ADDRESS?.slice(0,5)+"..."+process.env.DEFIOS_CONTRACT_ADDRESS?.slice(37,42)}
                    </a>
                </div>
            </div>

            <div className={`w-[90%] mx-auto  text-center text-[1.81vh] border-t border-[#9D9D9D] py-[3%] mb-[4%] mt-[6%] font-semibold`} >DAO creation {Math.floor(processStep/6 *100*100)/100}% completed</div>
        </div>
    );
}

export default CreationProcess;