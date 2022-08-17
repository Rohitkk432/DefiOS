import React from 'react'

import {PencilIcon} from '@heroicons/react/outline'

interface UserOptionsProps {
    assigned?:boolean
}

const UserOptions: React.FC<UserOptionsProps> = ({assigned}) => {

    const fontsizer2 = 'text-[calc(98vh/60)]';

    return (
        <>
        {(!assigned && assigned===undefined)?
        (
            // Assigned 
            <div className='bg-[#121418] w-full h-[7%] px-[2%] py-[2%] mt-[2%] text-xs font-semibold rounded-md border-[#2E2E2F] border flex flex-row align-center justify-between' >
                {/* user name */}
                <div className='flex flex-row'>
                    <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='w-[2.5vh] h-[2.5vh] mr-[1vh] rounded-full'/>
                    <div className={`text-[#D7D7D7] ${fontsizer2}`}>never2average</div>
                </div>
                {/* user distribution */}
                <div className={`px-[1%] ${fontsizer2} text-[#B5C3DB]
                flex flex-row align-center justify-center w-[18%]`} >
                    <div>58.5%</div> 
                    <PencilIcon className='w-[20%] ml-[10%] text-[#B5C3DB]'/>
                </div>
            </div>
        ):
        (
            // Unassigned 
            <div className='bg-[#121418] w-full h-[15%] px-[2%] py-[2%] mt-[2%] text-xs font-semibold rounded-md border-[#2E2E2F] border flex flex-col align-start justify-start' >
                <div className='flex flex-row align-center justify-between w-full mb-[3%]'>
                    {/* user name */}
                    <div className='flex flex-row'>
                        <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='w-[2.5vh] h-[2.5vh] mr-[1vh] rounded-full'/>
                        <div className={`text-[#D7D7D7] ${fontsizer2}`}>never2average</div>
                    </div>
                    {/* user distribution */}
                    <div className={`px-[1%] ${fontsizer2} text-[#B5C3DB]
                    flex flex-row align-center justify-center w-[18%]`} >
                        <div>58.5%</div> 
                    </div>
                </div>
                <div className='flex flex-row align-center justify-between w-full'>
                    <input type="text" name='newPercentage' className={`bg-[#121418] w-full py-[1%] px-[4%] ${fontsizer2} font-semibold rounded-l-md border-[#3A4E70] border border-r-0`} placeholder='Enter New %' />
                    {/* user distribution */}
                    <button className={`${fontsizer2} px-[5%] rounded-sm bg-[#91A8ED]`} >Update</button>
                </div>
            </div>
        )}
        </>
    );
}

export default UserOptions;