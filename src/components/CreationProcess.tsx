import React from 'react'

import {CheckIcon} from '@heroicons/react/outline'

interface CreationProcessProps {
    
}

const CreationProcess: React.FC<CreationProcessProps> = ({}) => {

    const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';

    return (
        <div 
        className='w-[19.5%] min-h-[42.2%] h-auto bg-[#121418] rounded-2xl text-white flex flex-col items-start justify-start pt-[1.5%]'
        >   
            {/* completed */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] ${fontsizer2} border rounded-full flex items-center justify-center bg-[#A7B9FC] border-[#A7B9FC]`}>
                    <CheckIcon className="w-[60%]"/>
                </div>
                <div className={`${fontsizer2} font-semibold text-[#A7B9FC] w-[70%]`}>
                    Verifying connection of github username with public key 
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] border-r border-solid border-[#A7B9FC]`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] ${fontsizer2} border rounded-full flex items-center justify-center bg-[#A7B9FC] border-[#A7B9FC]`}>
                    <CheckIcon className="w-[60%]"/>
                </div>
                <div className={`${fontsizer2} font-semibold text-[#A7B9FC] w-[70%]`}>
                    <div>Calling create_dao on</div>
                    <div>&lt;hex of DefiOS.sol&gt;</div>
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] border-r border-solid border-[#A7B9FC]`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] ${fontsizer2} border rounded-full flex items-center justify-center bg-[#A7B9FC] border-[#A7B9FC]`}>
                    <CheckIcon className="w-[60%]"/>
                </div>
                <div className={`${fontsizer2} font-semibold text-[#A7B9FC] w-[70%]`}>
                    Deploying DAO 
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] border-r border-solid border-[#A7B9FC]`}></div>

            {/* processing */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] ${fontsizer2} rounded-full flex flex-row items-center justify-center`}>

                    {/* loading spinner */}
                    <div className="lds-spinner">
                        <div></div><div></div><div></div><div></div>
                        <div></div><div></div><div></div><div></div>
                    </div>
                    
                </div>
                <div className={`${fontsizer2} font-semibold text-white w-[70%]`}>
                    Deploying Contract for token
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] border-r border-dashed border-[#727272]`}></div>

            {/* remaining */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] ${fontsizer2} border rounded-full border-dashed flex items-center justify-center border-[#727272]`}>
                </div>
                <div className={`${fontsizer2} font-semibold text-[#727272] w-[70%]`}>
                    Setting initial token distribution
                </div>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] border-r border-dashed border-[#727272]`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] ${fontsizer2} border rounded-full border-dashed flex items-center justify-center border-[#727272]`}>
                </div>
                <div className={`${fontsizer2} font-semibold text-[#727272] w-[70%]`}>
                    <div>Completing call back to</div>
                    <div>&lt;hex of DefiOS.sol&gt;</div> 
                </div>
            </div>

            <div className={`w-[90%] mx-auto  text-center ${fontsizer} border-t border-[#9D9D9D] py-[3%] mb-[4%] mt-[6%] font-semibold`} >DAO creation x% completed</div>
        </div>
    );
}

export default CreationProcess;