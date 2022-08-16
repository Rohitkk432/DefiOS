import React from 'react'
import ReposOption from './ReposOption';

import { SearchIcon } from '@heroicons/react/outline';

interface CreationMainProps {

}

const CreationMain: React.FC<CreationMainProps> = ({}) => {
    return (
        <div className='w-[27rem] h-[34rem] bg-[#121418] mx-10 rounded-2xl p-4 text-white flex flex-col justify-between items-center'>
            <div className='flex flex-col justify-between items-center w-full relative' >

                {/* Search feild */}
                <input type="text" className='bg-[#121418] w-full py-1.5 px-3 text-xs font-semibold rounded-md border-[#3A4E70] border' placeholder='Search repositories' />
                <SearchIcon className='h-4 w-4 absolute top-2 right-2' />

                {/* Repositories */}
                <ReposOption/>
                <ReposOption/>
                <ReposOption/>
                <ReposOption/>
            </div>

            {/* Submit Btn */}
            <button className='bg-[#91A8ED] w-full py-1.5 text-xs font-semibold rounded-md' >
                Choose Repository
            </button>
        </div>
    );
}

export default CreationMain;