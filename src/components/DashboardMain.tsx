import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'

import DaoMetadata from './DaoMetadata'

import {SearchIcon , GlobeAltIcon , UserCircleIcon} from '@heroicons/react/outline'
import { Switch } from '@headlessui/react'

import data from '../config/daotable.json';

interface DashboardMainProps {
    currentAccount: string | undefined
    network: string | undefined
}

const DashboardMain: React.FC<DashboardMainProps> = ({currentAccount,network}) => {
    const router = useRouter()

    const [enabled, setEnabled] = useState(false)

    return (
        <div className='w-[80%] h-full flex flex-col justify-between items-end px-[1%] py-[1%] relative text-white'>

            <div className='w-full h-[6%] flex flex-row justify-end items-start'>
                <div className='flex flex-row justify-center items-center h-full px-[1.5%] py-[1%] bg-[#262B36] rounded-md ml-[1%]'>
                    {/* <img src="https://res.cloudinary.com/rohitkk432/image/upload/v1661271366/metamaskAccount_j0e9ij.svg" className='h-[3.5vh]  mr-[5%]' /> */}
                    <div className='text-[2.2vh]'>{network}</div>
                </div>
                <div className='flex flex-row justify-center items-center h-full px-[1.5%] py-[1%] bg-[#262B36] rounded-md ml-[1%]'>
                    <img src="https://res.cloudinary.com/rohitkk432/image/upload/v1661271366/metamaskAccount_j0e9ij.svg" className='h-[3.5vh]  mr-[5%]' />
                    <div className='text-[2.2vh]' >{currentAccount?.slice(0,6)+"..."+currentAccount?.slice(38,42)}</div>
                </div>

                {/* create Dao btn */}
                <button className='flex flex-row justify-center items-center h-full px-[1.5%] py-[1%] bg-[#91A8ED] rounded-md ml-[1%] text-[2vh] px-[5%] font-semibold'
                onClick={()=>{
                    localStorage.removeItem('DaoCreationData')
                    localStorage.removeItem('distributionOk')
                    router.push('/creation/1')
                }}>
                    Create New DAO
                </button>
            </div>


            <div className='w-full h-[90%] px-[1.5%] py-[1.5%] bg-[#262B36] rounded-lg'>
                <div className='w-full flex flex-row justify-between items-center' >
                    {/* Search bar */}
                    <div className='h-[5vh] w-[80%] relative flex flex-row'>
                        <input type="text" className='w-full h-full rounded-md bg-[#121418] border border-[#3A4E70] text-[1.8vh] pl-[2%]' placeholder='Search DAOs on the basis of name or metadata' />
                        <SearchIcon className='w-[2%] absolute top-[25%] right-[2%]' />
                    </div>
                    
                    {/* Switch */}
                    <div className='h-[5vh] w-[20%] relative flex flex-row items-center justify-center'>
                        <Switch
                            checked={enabled}
                            onChange={setEnabled}
                            className='bg-[#121418] relative inline-flex h-[4.5vh] w-[85%] items-center rounded-lg px-[4%] flex flex-row justify-between items-center'
                        >
                            <span
                                className={`${
                                enabled ? 'translate-x-[42%]' : 'translate-x-[0%]'
                                } transform transition ease-in duration-300 absolute top-0 left-0 inline-block h-[4.5vh] w-[70%] bg-[#91A8ED] rounded-lg`}
                            >
                                {
                                    enabled ? (
                                        <div className='flex flex-row justify-end items-center w-full h-full px-[5%]'>
                                            <div className='text-[2vh] mx-[5%] font-semibold'>My DAOs</div>
                                            <UserCircleIcon className='h-[3.5vh]' />
                                        </div>
                                    ) : (
                                        <div className='flex flex-row justify-start items-center w-full h-full px-[5%]'>  
                                            <div></div>
                                            <GlobeAltIcon className='h-[3.5vh]' />
                                            <div className='text-[2vh] mx-[5%] font-semibold'>Global DAOs</div>
                                        </div>
                                    )
                                }
                            </span>
                            <GlobeAltIcon className='h-[3.5vh]'/>
                            <UserCircleIcon className='h-[3.5vh]'/>
                        </Switch>
                    </div>
                </div>

                <div className='w-full h-[3vh] flex flex-row justify-start items-center mt-[2%] mb-[0.5%] pl-[1%] text-[#CACACA] text-[1.7vh] pr-[1%]'>
                    <div className='w-[18%] h-full mx-[0.5%]'>DAO name</div>
                    <div className='w-[20%] h-full mx-[0.5%]'>Repository</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Role</div>
                    <div className='w-[13%] h-full mx-[0.5%]'>Created by</div>
                    <div className='w-[13%] h-full mx-[0.5%]'>Total Staked</div>
                    <div className='w-[6%] h-full mx-[0.5%]'>Open Issues</div>
                    <div className='w-[13%] h-full mx-[0.5%]'>Pending Action</div>
                </div>
                <div className='w-full pr-[0.2%] h-[84%] overflow-y-scroll customScrollbar' >
                    {(data && data.length!==0 )?
                        data.map((dataVal:any, index:any) => {
                            return <DaoMetadata metadata={dataVal} key={index}/>
                        }):
                        <div className='w-full h-full flex flex-col items-center justify-center' >No DAOs Created yet</div>
                    }
                </div>
            </div>
        </div>


    );
}

export default DashboardMain;