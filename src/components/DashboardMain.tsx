import React from 'react'
import { useState,useEffect,useMemo } from 'react'
import { useRouter } from 'next/router'

import DaoMetadata from './DaoMetadata'

import {SearchIcon , GlobeAltIcon , UserCircleIcon} from '@heroicons/react/outline'
import { Switch } from '@headlessui/react'

import {ethers} from 'ethers'
declare let window:any
import contractAbi from "./ContractFunctions/DaoFactoryABI.json"

interface DashboardMainProps {
    currentAccount: string | undefined
    network: string | undefined
    chainId : number | undefined
}

const DashboardMain: React.FC<DashboardMainProps> = ({currentAccount,network,chainId}) => {
    const router = useRouter()

    const [seeMyDaos, setSeeMyDaos] = useState(true)

    const contractAddress:any = process.env.NEXT_PUBLIC_DEFIOS_CONTRACT_ADDRESS;

    const [DaoList, setDaoList] = useState<any>()

    const listAllUserDao = async()=>{
        const daoList:any=[];
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let defiosContract : ethers.Contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const userDaoCount = await defiosContract.getUserDAOCount(localStorage.getItem('currentAccount'));
        for(let i=0;i<userDaoCount;i++){
            const daoId = await defiosContract.userDAOs(localStorage.getItem('currentAccount'),i)
            const daoInfo = await defiosContract.getDAOInfo(daoId)
            const DaoInfoObj = {
                "DaoId":daoId,
                "DAO":daoInfo[0],
                "owner":daoInfo[1],
                "team":daoInfo[2],
                "metadata":daoInfo[3],
            }
            DaoInfoObj.metadata = await fetch(`https://gateway.ipfs.io/ipfs/${DaoInfoObj.metadata}`).then(res=>res.json())
            DaoInfoObj.metadata.tokenImg = `https://gateway.ipfs.io/ipfs/${DaoInfoObj.metadata.tokenImg}`
            daoList.push(DaoInfoObj)
        }
        // console.log(daoList)
        setDaoList(daoList)
        return daoList;
    }

    const listAllGlobalDao = async()=>{
        const daoList:any=[];
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let defiosContract : ethers.Contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const globalDaoCount = await defiosContract.DAOID();
        for(let i=1;i<=globalDaoCount;i++){
            const daoInfo = await defiosContract.getDAOInfo(i)
            const DaoInfoObj = {
                "DaoId":i,
                "DAO":daoInfo[0],
                "owner":daoInfo[1],
                "team":daoInfo[2],
                "metadata":daoInfo[3],
            }
            DaoInfoObj.metadata = await fetch(`https://gateway.ipfs.io/ipfs/${DaoInfoObj.metadata}`).then(res=>res.json())
            DaoInfoObj.metadata.tokenImg = `https://gateway.ipfs.io/ipfs/${DaoInfoObj.metadata.tokenImg}`
            daoList.push(DaoInfoObj)
        }
        // console.log(daoList)
        setDaoList(daoList)
        return daoList;
    }

    //search logic
    const [search, setSearch] = useState("");

    const DaoSearch = useMemo(() => {
        if (search==="") return DaoList;
        return DaoList.filter((_dao:any) => {
            return (
                _dao.DAO.toLowerCase().includes(search.toLowerCase()) ||
                _dao.metadata.tokenName.toLowerCase().includes(search.toLowerCase())||
                _dao.metadata.tokenSymbol.toLowerCase().includes(search.toLowerCase())||
                _dao.metadata.daoName.toLowerCase().includes(search.toLowerCase())||
                _dao.metadata.repoName.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [search,DaoList]);

    useEffect(()=>{
        if(seeMyDaos){
            listAllUserDao()
        }else if(!seeMyDaos){
            listAllGlobalDao()
        }
    },[seeMyDaos,currentAccount,chainId])


    return (
        <div className='w-[80%] h-full flex flex-col justify-between items-end px-[1%] py-[1%] relative text-white'>

            <div className='w-full h-[6%] flex flex-row justify-end items-start'>
                <div className='flex flex-row justify-center items-center h-full px-[1.5%] py-[1%] bg-[#262B36] rounded-md ml-[1%]'>
                    {/* <img src="https://res.cloudinary.com/rohitkk432/image/upload/v1661271366/metamaskAccount_j0e9ij.svg" className='h-[3.5vh]  mr-[5%]' /> */}
                    <div className='text-[2.2vh]'>
                        {network!=="unknown"?network:chainId===245022926?'remote proxy — solana devnet':'unknown'}
                    </div>
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
                        <input type="text" className='w-full h-full rounded-md bg-[#121418] border border-[#3A4E70] text-[1.8vh] pl-[2%]' placeholder='Search DAOs on the basis of name or metadata' value={search} onChange={(e) => setSearch(e.target.value)} />
                        <SearchIcon className='w-[2%] absolute top-[25%] right-[2%]' />
                    </div>
                    
                    {/* Switch */}
                    <div className='h-[5vh] w-[20%] relative flex flex-row items-center justify-center'>
                        <Switch
                            checked={seeMyDaos}
                            onChange={setSeeMyDaos}
                            className='bg-[#121418] relative inline-flex h-[4.5vh] w-[85%] items-center rounded-lg px-[4%] flex flex-row justify-between items-center'
                        >
                            <span
                                className={`${
                                seeMyDaos ? 'translate-x-[42%]' : 'translate-x-[0%]'
                                } transform transition ease-in duration-300 absolute top-0 left-0 inline-block h-[4.5vh] w-[70%] bg-[#91A8ED] rounded-lg`}
                            >
                                {
                                    seeMyDaos ? (
                                        <div className='flex flex-row justify-end items-center w-full h-full px-[5%]'>
                                            <div className='text-[1.7vh] mx-[5%] font-semibold'>My DAOs</div>
                                            <UserCircleIcon className='h-[3.5vh]' />
                                        </div>
                                    ) : (
                                        <div className='flex flex-row justify-start items-center w-full h-full px-[5%]'>  
                                            <div></div>
                                            <GlobeAltIcon className='h-[3.5vh]' />
                                            <div className='text-[1.7vh] mx-[5%] font-semibold'>Global DAOs</div>
                                        </div>
                                    )
                                }
                            </span>
                            <GlobeAltIcon className='h-[3.5vh]'/>
                            <UserCircleIcon className='h-[3.5vh]'/>
                        </Switch>
                    </div>
                </div>

                <div className='w-full h-[3vh] flex flex-row justify-start items-center mt-[2%] mb-[0.5%] pl-[1%] text-[#CACACA] text-[1.5vh] pr-[1%]'>
                    <div className='w-[18%] h-full mx-[0.5%]'>DAO name</div>
                    <div className='w-[20%] h-full mx-[0.5%]'>Repository</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Role</div>
                    <div className='w-[13%] h-full mx-[0.5%]'>Created by</div>
                    <div className='w-[13%] h-full mx-[0.5%]'>Total Staked</div>
                    <div className='w-[6%] h-full mx-[0.5%]'>Open Issues</div>
                    <div className='w-[13%] h-full mx-[0.5%]'>Pending Action</div>
                </div>
                <div className='w-full pr-[0.2%] h-[84%] overflow-y-scroll customScrollbar' >
                    {(DaoSearch && DaoSearch.length!==0 )?
                        DaoSearch.map((dataVal:any, index:any) => {
                            return <DaoMetadata metadata={dataVal} key={index}/>
                        }):(DaoSearch===undefined)?
                        <div className='w-full h-full flex flex-col items-center justify-center' >Loading...</div>:(DaoSearch && DaoSearch.length===0)?
                        <div className='w-full h-full flex flex-col items-center justify-center' >No DAOs Created yet</div>:null
                    }
                </div>
            </div>
        </div>


    );
}

export default DashboardMain;