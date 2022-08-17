import React from 'react'
import UserOptions from './UserOptions';
import { InformationCircleIcon , SearchIcon } from '@heroicons/react/outline';

interface CreationDistributionProps {

}

const CreationDistribution: React.FC<CreationDistributionProps> = ({}) => {

    const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';

    return (
        <div 
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between items-center'
        >
            <div className='flex flex-col justify-start items-start h-[90%] w-full' >
                {/* input feild */}
                <div className='w-full relative'>
                    <input type="text" name='DaoFees' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] ${fontsizer2} font-semibold rounded-md border-[#373737] border`} placeholder='Enter DAO Fees' />
                    <InformationCircleIcon className='w-[5%] absolute top-[30%] right-[3%]' />
                </div>
                <div className='w-full relative'>
                    <input type="text" name='EnterDistribution' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] ${fontsizer2} font-semibold rounded-md border-[#373737] border`} placeholder='Enter Distribution %' />
                    <InformationCircleIcon className='w-[5%] absolute top-[30%] right-[3%]' />
                </div>

                {/* options */}
                <div className={`${fontsizer} mt-[3%] font-semibold`} >Token Distribution Algorithm <InformationCircleIcon className='w-[3.5%] inline' /></div>

                <div className={`${fontsizer2} mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        Repository creator
                    </div>
                </div>
                <div className={`${fontsizer2} mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        By amount of code contributed ( minified )
                    </div>
                </div>
                <div className={`${fontsizer2} mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        By duration of project involvement ( compute intensive ) 
                    </div>
                </div>

                {/* network */}
                <div className={`${fontsizer} mt-[3%] font-semibold`} >Supported Networks</div>

                <div className={`${fontsizer2} mt-[2%] w-full flex flex-row w-full justify-between items-center`}>
                    <div className='flex flex-row w-full justify-start items-center'>
                        <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                            <input type="radio" name="NetworkOp" className='peer absolute opacity-0 w-full h-full cursor-pointer' />
                            <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                            flex justify-center items-center
                            peer-checked:after:block
                            after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                        </div>
                        <div>
                            Neon Testnet
                        </div>
                    </div>
                    <div className='w-[30%] text-[#A7B9FC]' >
                        + Add Network
                    </div>
                </div>

                {/* Assign Distribution */}
                {/* Search User */}
                <div className='w-full relative mt-[3%]'>
                    <input type="text" name='SearchUser' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] ${fontsizer2} font-semibold rounded-md border-[#3A4E70] border`} placeholder='Search contributors by username' />
                    <SearchIcon className='w-[5%] absolute top-[30%] right-[3%] text-[#3A4E70]' />
                </div>
                {/* Contributor Assigned  */}
                <UserOptions/>
                {/* Contributor Assigning  */}
                <UserOptions assigned={true}/>

            </div>
            {/* Submit Btn */}
            <button className={`bg-[#91A8ED] w-full py-[2%] ${fontsizer2} font-semibold rounded-md`} >
                Confirm Token Distribution
            </button>
        </div>
    );
}

export default CreationDistribution;