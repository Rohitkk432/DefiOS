import React from 'react'
import {SearchIcon} from '@heroicons/react/outline'

import DaoDetailsMetadata from './DaoDetailsMetadata'
import DaoDetailsTop from './DaoDetailsTop'

import data from '../config/daodetails.json';

// import { useRouter } from 'next/router'

interface DaoDetailsBottomProps {

}

const DaoDetailsBottom: React.FC<DaoDetailsBottomProps> = ({}) => {
    // const router = useRouter()

    return (
        <div className='w-[80%] h-full flex flex-col justify-between items-end px-[1%] py-[1%] relative text-white overflow-hidden'>
            <DaoDetailsTop/>
            <div className='w-full h-[50%] px-[1.5%] py-[1.5%] bg-[#262B36] rounded-lg'>
                <div className='w-full flex flex-row justify-between items-center' >
                    {/* Search bar */}
                    <div className='h-[5vh] w-[80%] relative flex flex-row'>
                        <input type="text" className='w-full h-full rounded-md bg-[#121418] border border-[#3A4E70] text-[1.8vh] pl-[2%]' placeholder='Search DAOs on the basis of name or metadata' />
                        <SearchIcon className='w-[2%] absolute top-[25%] right-[2%]' />
                    </div>
                    {/* create Dao btn */}
                    <button className='flex flex-row justify-center items-center h-[5vh] px-[1.5%] py-[1%] bg-[#91A8ED] rounded-md ml-[1%] text-[1.8vh] px-[5%] font-semibold'
                    onClick={()=>{
                        // localStorage.removeItem('DaoCreationData')
                        // localStorage.removeItem('distributionOk')
                        // router.push('/creation/1')
                    }}>
                        Create New Issue
                    </button>
                </div>

                <div className='w-full h-[3vh] flex flex-row justify-start items-center mt-[2%] mb-[0.5%] pl-[1%] text-[#CACACA] text-[1.7vh] pr-[1%]'>
                    <div className='w-[30%] h-full mx-[0.5%]'>Title</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Created by</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Created at</div>
                    <div className='w-[30%] h-full mx-[0.5%]'>Tags</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Amount Staked</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Top Staker</div>
                </div>
                <div className='w-full pr-[0.2%] h-[72%] overflow-y-scroll customScrollbar' >
                    {(data && data.length!==0 )?
                        data.map((dataVal:any, index:any) => {
                            return <DaoDetailsMetadata metadata={dataVal} key={index}/>
                        }):
                        <div className='w-full h-full flex flex-col items-center justify-center' >No DAOs Created yet</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default DaoDetailsBottom;