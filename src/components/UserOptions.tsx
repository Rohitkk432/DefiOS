import React from 'react'

import {PencilIcon} from '@heroicons/react/outline'

interface UserOptionsProps {

}

const UserOptions: React.FC<UserOptionsProps> = ({}) => {

    const fontsizer2 = 'text-[calc(98vh/60)]';

    return (
        // Assigned 
        <div className='bg-[#121418] w-full h-[8%] px-[2%] py-[2%] mt-[2%] text-xs font-semibold rounded-md border-[#2E2E2F] border flex flex-row align-center justify-between' >
            {/* user name */}
            <div className='flex flex-row'>
                <div className='w-[2.5vh] h-[2.5vh] mr-[1vh] bg-white rounded-full'></div>
                <div className={`text-[#D7D7D7] ${fontsizer2}`}>never2average</div>
            </div>
            {/* user distribution */}
            <div className={`px-[1%] ${fontsizer2} text-[#B5C3DB]
            flex flex-row align-center justify-center w-[18%]`} >
                <div>58.5%</div> 
                <PencilIcon className='w-[20%] ml-[10%] text-[#B5C3DB]'/>
            </div>
        </div>
    );
}

export default UserOptions;