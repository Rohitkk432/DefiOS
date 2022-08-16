import React from 'react'

import {StarIcon, LinkIcon} from '@heroicons/react/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeFork } from '@fortawesome/free-solid-svg-icons';

interface ReposOptionProps {

}

const ReposOption: React.FC<ReposOptionProps> = ({}) => {
    return (
        <div className='bg-[#121418] w-full h-22 p-2 mt-3 text-xs font-semibold rounded-md border-[#2E2E2F] border relative' >
            {/* repo visibility */}
            <div className='absolute top-2 right-2 border border-[#3A4E70] rounded px-3 py-0.5 text-[8px] text-[#B5C3DB] ' >Public</div>
            {/* repo name */}
            <div className='flex flex-row'>
                <div className='w-5 h-5 bg-white rounded-full'></div>
                <div className='ml-2 text-[#D7D7D7]'>never2average/defios-contracts</div>
            </div>
            {/* repo description */}
            <div className='w-[90%] text-[7px] mt-2 text-[#BFBFBF]'>
                2 line repository description 2 line repository description 2 line repository description 2 line repository description 2 line repository description 2 line repository description 2 line repository description
            </div>
            {/* repo stat info */}
            <div className='flex flex-row mt-2 items-center text-[#B5C3DB]'>
                <StarIcon className='w-3 h-3 mr-1'/>
                <div className='mr-4'>11</div>
                <FontAwesomeIcon className='w-3 h-3 mr-1' icon={faCodeFork} aria-hidden="true" />
                <div className='mr-4'>22</div>
                <LinkIcon className='w-3 h-3 mr-1'/>
            </div>
            {/* repo choosen*/}
            <input type="radio" name="RepoForDAO" className='absolute bottom-3 right-3' />
        </div>
    );
}

export default ReposOption;