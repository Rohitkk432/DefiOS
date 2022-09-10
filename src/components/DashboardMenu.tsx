import React from 'react'
// import ActionableItems from './ActionableItems'

import {useSession} from 'next-auth/react'
import Link from 'next/link'

interface DashboardMenuProps {

}

const DashboardMenu: React.FC<DashboardMenuProps> = ({}) => {

    const {data:session} = useSession()

    return (
        <div className='w-[20%] h-full bg-[#191C21] flex flex-col justify-start items-center px-[1.5%] py-[1%] pt-[7%] relative text-white'>
            <Link href='/dashboard'>
                <img src="/assets/images/defi-os-logo.png" className='h-[6vh] absolute top-[2.5vh] left-[6%]' />
            </Link>
            <img src={session?.user?.image || ''} className='h-[9vh] mb-[2vh] rounded-full' />
            <div className='text-[#CACACA] mb-[4vh] text-[2.5vh]'>Hey! {session?.user?.name || ''}</div>
            
            {/* options */}
            <div className='w-full h-[4.5vh] mb-[1vh] rounded-md bg-[#121418] flex flex-row justify-between items-center px-[7%]'>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/userCheckIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Active Since</div>
                </div>
                <div className='text-[1.6vh] w-[25%] text-center' >10 days</div>
            </div>
            <a href="https://github.com/" target="_blank" className='w-full h-[4.5vh] mb-[1vh] rounded-md flex flex-row justify-between items-center px-[7%] hover:border hover:border-gray-400 '>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/bulbPuzzleIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Biggest Solve</div>
                </div>
            </a>
            <div className='w-full h-[4.5vh] mb-[1vh] rounded-md flex flex-row justify-between items-center px-[7%]'>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/solvingIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Total Issues Solved</div>
                </div>
                <div className='text-[1.6vh] w-[25%] text-center' >5</div>
            </div>
            <div className='w-full h-[4.5vh] mb-[1vh] rounded-md flex flex-row justify-between items-center px-[7%]'>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/DaoIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Total DAOs created</div>
                </div>
                <div className='text-[1.6vh] w-[25%] text-center' >2</div>

            </div>
            <div className='w-full h-[4.5vh] mb-[1vh] rounded-md flex flex-row justify-between items-center px-[7%]'>
                <div className='flex flex-row justify-start items-center w-[70%] h-full'>
                    <img src='/assets/images/earningIcon.svg' className='h-[2.7vh] w-[2.7vh] mr-[8%]'/>
                    <div className='text-[1.6vh]' >Total earnings</div>
                </div>
                <div className='text-[1.6vh] w-[25%] text-center' >$40</div>
            </div>

            {/* <div className='w-full text-left text-[2vh] mt-[4%] mb-[4%] text-[#CACACA]' >Actionable Items</div>
            <div className='w-full h-[40%] overflow-y-scroll customScrollbar'>
                <ActionableItems />
                <ActionableItems />
                <ActionableItems />
            </div> */}
        </div>
    );
}

export default DashboardMenu;