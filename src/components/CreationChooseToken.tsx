import React from 'react'

import { PhotographIcon } from '@heroicons/react/outline';

interface CreationChooseTokenProps {

}

const CreationChooseToken: React.FC<CreationChooseTokenProps> = ({}) => {

    // const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';

    return (
        <div 
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between items-center'
        >
            <div className='flex flex-col justify-center items-center h-[90%] w-full relative' >
                {/* image input */}
                <div className="w-[12vh] h-[12vh] flex justify-center items-center relative rounded-full border border-[#373737] overflow-hidden">
                    <PhotographIcon className='h-1/2 w-1/2 text-[#373737] stroke-1' />
                    <input type="file" name="TokenImg" className='opacity-0 absolute top-0 left-0 w-full h-full' />
                </div>
                <div className={`${fontsizer2} mt-[2%]`}>Token Logo</div>
                {/* input feild */}
                <input type="text" name='DaoName' className={`bg-[#121418] w-full py-[2%] px-[4%] mb-[2%] mt-[8%] ${fontsizer2} font-semibold rounded-md border-[#373737] border`} placeholder='Enter DAO Name' />
                <input type="text" name='TokenName' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[2%] ${fontsizer2} font-semibold rounded-md border-[#373737] border`} placeholder='Enter the Token Name' />
                <input type="text" name='TokenSymbol'className={`bg-[#121418] w-full py-[2%] px-[4%] my-[2%] ${fontsizer2} font-semibold rounded-md border-[#373737] border`} placeholder='Enter the Token Symbol' />

            </div>

            {/* Submit Btn */}
            <button className={`bg-[#91A8ED] w-full py-[2%] ${fontsizer2} font-semibold rounded-md`} >
                Confirm Token Specification
            </button>
        </div>
    );
}

export default CreationChooseToken;