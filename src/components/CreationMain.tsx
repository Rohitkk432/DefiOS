import React from 'react'
import ReposOption from './ReposOption';

import { SearchIcon } from '@heroicons/react/outline';

interface CreationMainProps {

}

const CreationMain: React.FC<CreationMainProps> = ({}) => {

    const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';

    return (
        <div 
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between items-center'
        >
            <div className='flex flex-col justify-start items-center h-[90%] w-full relative' >

                {/* Search feild */}
                <input type="text" className={`bg-[#121418] w-full py-[2%] px-[4%] ${fontsizer2} font-semibold rounded-md border-[#3A4E70] border`} placeholder='Search repositories' />
                <SearchIcon className='w-[5%] absolute top-[1.5%] right-[3%]' />

                {/* Repositories */}
                <ReposOption/>
                <ReposOption/>
                <ReposOption/>
                <ReposOption/>
                <ReposOption/>
            </div>

            {/* Submit Btn */}
            <button className={`bg-[#91A8ED] w-full py-[2%] ${fontsizer2} font-semibold rounded-md`} >
                Choose Repository
            </button>
        </div>
    );
}

export default CreationMain;