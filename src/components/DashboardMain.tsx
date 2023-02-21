import React from 'react'
import { useState,useEffect,useMemo } from 'react'
import { useRouter } from 'next/router'
import {useSession} from 'next-auth/react'

import DaoMetadata from './DaoMetadata'

import {SearchIcon , GlobeAltIcon , UserCircleIcon, SupportIcon} from '@heroicons/react/outline'
import { Switch } from '@headlessui/react'

import {ethers} from 'ethers'
declare let window:any
import contractAbi from "./ContractFunctions/DaoFactoryABI.json"

import DaoMetadataDummy from "../config/DaoMetadata.json"

interface DashboardMainProps {
    currentAccount: string | undefined
    network: string | undefined
    chainId : number | undefined
    runTour : boolean
    setRunTour : any
}

const DashboardMain: React.FC<DashboardMainProps> = ({currentAccount,network,chainId,runTour,setRunTour}) => {
    const router = useRouter()
    const {data:session} = useSession()

    const [seeMyDaos, setSeeMyDaos] = useState(true)
    const [loadingData, setLoadingData] = useState(true)

    const contractAddress:any = process.env.NEXT_PUBLIC_DEFIOS_CONTRACT_ADDRESS;

    const [DaoList, setDaoList] = useState<any>()

    const listAllUserDao = async()=>{
        const dataInStorage = localStorage.getItem('dashUserDaos');
        const storageCount = dataInStorage!==null ? JSON.parse(dataInStorage).length :null ;
        if(dataInStorage!==null){
            setDaoList(JSON.parse(dataInStorage));
        }
        setLoadingData(true)
        
        const daoList:any=[];
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let defiosContract : ethers.Contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const userDaoCount = await defiosContract.getUserDAOCount(localStorage.getItem('currentAccount')).then((res:any)=>res).catch(()=>0);
        if(Number(userDaoCount)===storageCount || userDaoCount===0){
            setLoadingData(false)
            return daoList;
        }

        for(let i=0;i<userDaoCount;i++){

            const daoId = await defiosContract.userDAOs(localStorage.getItem('currentAccount'),i)
            const daoInfo = await defiosContract.getDAOInfo(daoId)
            
            if(dataInStorage!==null && dataInStorage.includes(daoInfo.metadata)){
                continue;
            }
            if((JSON.stringify(daoList)).includes(daoInfo.metadata)){
                continue;
            }

            const DaoInfoObj = {
                "DaoId":Number(daoId),
                "DAO":daoInfo.DAOAddress,
                "owner":daoInfo.owner,
                "team":daoInfo.team,
                "metadata":daoInfo.metadata,
                "metaHash":daoInfo.metadata
            }
            DaoInfoObj.metadata = await fetch(`https://tan-legal-bear-46.mypinata.cloud/ipfs/${DaoInfoObj.metadata}`).then(res=>res.json())
            DaoInfoObj.metadata.tokenImg = `https://tan-legal-bear-46.mypinata.cloud/ipfs/${DaoInfoObj.metadata.tokenImg}`
            const creatorOfDao = await fetch(`https://api.github.com/user/${DaoInfoObj.metadata.partners[0]}`,{
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${(session as any)?.accessToken}` },
                    }).then(res=>res.json()).catch(err=>console.log(err))

            DaoInfoObj.metadata.creatorGithub = creatorOfDao.login;

            daoList.push(DaoInfoObj)
            if(dataInStorage===null){
                setDaoList(daoList)
            }
        }
        if(dataInStorage!==null){
            setDaoList([...JSON.parse(dataInStorage),...daoList])
            localStorage.setItem('dashUserDaos',JSON.stringify([...JSON.parse(dataInStorage),...daoList]))
        }else{
            setDaoList(daoList)
            localStorage.setItem('dashUserDaos',JSON.stringify(daoList))
        }
        setLoadingData(false)
        return daoList;
    }

    const listAllGlobalDao = async()=>{
        const dataInStorage = localStorage.getItem('dashGlobalDaos');
        const storageCount = dataInStorage!==null ? JSON.parse(dataInStorage).length :null ;
        if(dataInStorage!==null){
            setDaoList(JSON.parse(dataInStorage));
        }
        setLoadingData(true)

        const daoList:any=[];
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let defiosContract : ethers.Contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const globalDaoCount = await defiosContract.DAOID().then((res:any)=>res).catch(()=>0);
        if(Number(globalDaoCount)===storageCount || globalDaoCount===0){
            setLoadingData(false)
            return daoList;
        }

        for(let i=1;i<=globalDaoCount;i++){
            const daoInfo = await defiosContract.getDAOInfo(i)

            if(dataInStorage!==null && dataInStorage.includes(daoInfo.metadata)){
                continue;
            }
            if((JSON.stringify(daoList)).includes(daoInfo.metadata)){
                continue;
            }

            const DaoInfoObj = {
                "DaoId":Number(i),
                "DAO":daoInfo.DAOAddress,
                "owner":daoInfo.owner,
                "team":daoInfo.team,
                "metadata":daoInfo.metadata,
                "metaHash":daoInfo.metadata
            }
            DaoInfoObj.metadata = await fetch(`https://tan-legal-bear-46.mypinata.cloud/ipfs/${DaoInfoObj.metadata}`).then(res=>res.json())
            DaoInfoObj.metadata.tokenImg = `https://tan-legal-bear-46.mypinata.cloud/ipfs/${DaoInfoObj.metadata.tokenImg}`
            const creatorOfDao = await fetch(`https://api.github.com/user/${DaoInfoObj.metadata.partners[0]}`,{
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${(session as any)?.accessToken}` },
                    }).then(res=>res.json()).catch(err=>console.log(err))

            DaoInfoObj.metadata.creatorGithub = creatorOfDao.login;

            daoList.push(DaoInfoObj)
            if(dataInStorage===null){
                setDaoList(daoList)
            }
        }
        if(dataInStorage!==null){
            setDaoList([...JSON.parse(dataInStorage),...daoList])
            localStorage.setItem('dashGlobalDaos',JSON.stringify([...JSON.parse(dataInStorage),...daoList]))
        }else{
            setDaoList(daoList)
            localStorage.setItem('dashGlobalDaos',JSON.stringify(daoList))
        }
        setLoadingData(false)
        return daoList;
    }

    //search logic
    const [search, setSearch] = useState("");

    const DaoSearch = useMemo(() => {
        if (search==="") return DaoList;
        return DaoList.filter((_dao:any) => {
            if(search.startsWith('creator:')){
                return (
                    _dao.metadata.creatorGithub.toLowerCase().includes(search.slice(8).toLowerCase())
                )
            }else if(search.startsWith('token:')){
                return (
                    _dao.metadata.tokenName.toLowerCase().includes(search.slice(6).toLowerCase())||
                    _dao.metadata.tokenSymbol.toLowerCase().includes(search.slice(6).toLowerCase())
                )
            }else if(search.startsWith('dao:')){
                return (
                    _dao.metadata.daoName.toLowerCase().includes(search.slice(4).toLowerCase())
                )
            }else if(search.startsWith('repo:')){
                return (
                    _dao.metadata.repoName.toLowerCase().includes(search.slice(5).toLowerCase())
                )
            }else if(search.startsWith('address:')){
                return (
                    _dao.metadata.repoName.toLowerCase().includes(search.slice(8).toLowerCase())
                )
            }
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
        if(currentAccount!==null && currentAccount!=="" && currentAccount!==undefined){
            if(seeMyDaos){
                listAllUserDao()
            }else if(!seeMyDaos){
                listAllGlobalDao()
            }
            // console.log(currentAccount , network, chainId)
        }else{
            setDaoList(DaoMetadataDummy);
            setLoadingData(false);
        }
    },[seeMyDaos,currentAccount,chainId])


    return (
        <div className='w-[80%] h-full flex flex-col justify-between items-end px-[1%] py-[1%] relative text-white'>

            <button className={`flex flex-row justify-center items-center 
            ${runTour?"text-gray-600":"text-white"}
            py-[1vh] rounded-[1vh] absolute top-[2vh] left-[3vh] text-white flex flex-row items-center justify-center`}
            onClick={()=>{
                setRunTour(true);
            }}>
                <SupportIcon className="h-[3.5vh] w-[3.5vh] mr-[1vh]"/>
                <div className='text-[2.8vh] font-semibold'>Tutorial</div>
            </button>

            <div className='w-full h-[6%] flex flex-row justify-end items-start'>
                <div className='flex flex-row justify-center items-center h-full px-[1.5%] py-[1%] bg-[#262B36] rounded-md ml-[1%]'>
                    {/* <img src="https://res.cloudinary.com/rohitkk432/image/upload/v1661271366/metamaskAccount_j0e9ij.svg" className='h-[3.5vh]  mr-[5%]' /> */}
                    {(currentAccount!==null && currentAccount!=="" && currentAccount!==undefined)?
                    <div className='text-[2.2vh]'>
                        {network!=="unknown"?network:chainId===245022926?'Solana Devnet':'unknown'}
                    </div>:
                    <div className='text-[2.2vh]'>
                        Solana Devnet
                    </div>
                    }
                </div>
                <div className='flex flex-row justify-center items-center h-full px-[1.5%] py-[1%] bg-[#262B36] rounded-md ml-[1%]'>
                    <img src="https://res.cloudinary.com/rohitkk432/image/upload/v1661271366/metamaskAccount_j0e9ij.svg" className='h-[3.5vh]  mr-[5%]' />
                    {(currentAccount!==null && currentAccount!=="" && currentAccount!==undefined)?
                    <div className='text-[2.2vh]' >{currentAccount?.slice(0,5)+"..."+currentAccount?.slice(38,42)}</div>:
                    <div className='text-[2.2vh]' >{"0xA7b...ed028"}</div>
                    }
                </div>

                {/* create Dao btn */}
                <button className='dash__step2 flex flex-row justify-center items-center h-full px-[1.5%] py-[1%] bg-[#91A8ED] rounded-md ml-[1%] text-[2vh] px-[5%] font-semibold'
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
                            <GlobeAltIcon className='dash__step3 h-[3.5vh]'/>
                            <UserCircleIcon className='dash__step4 h-[3.5vh]'/>
                        </Switch>
                    </div>
                </div>

                <div className='w-full h-[3vh] flex flex-row justify-start items-center mt-[2%] mb-[0.5%] pl-[1%] text-[#CACACA] text-[1.5vh] pr-[1%]'>
                    <div className='w-[18%] h-full mx-[0.5%]'>DAO name</div>
                    <div className='w-[25%] h-full mx-[0.5%]'>Repository</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Role</div>
                    <div className='w-[13%] h-full mx-[0.5%]'>Created by</div>
                    <div className='w-[21%] h-full mx-[0.5%]'>Total Staked</div>
                    <div className='w-[6%] h-full mx-[0.5%]'>Open Issues</div>
                    {/* <div className='w-[13%] h-full mx-[0.5%]'>Pending Action</div> */}
                </div>
                <div className='w-full pr-[0.2%] h-[84%] overflow-y-scroll customScrollbar' >
                    {loadingData &&
                        <div className='w-full my-[3vh] flex flex-row items-center justify-center' >
                            <svg aria-hidden="true" className="w-[5vh] h-[5vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <div className='text-[2.5vh] ml-[2vh]' >Checking for more DAOs</div>
                        </div>
                    }
                    {(DaoSearch && DaoSearch.length!==0 )?
                        DaoSearch.map((dataVal:any, index:any) => {
                            return <DaoMetadata metadata={dataVal} key={index}/>
                        }):(DaoSearch && DaoSearch.length===0 && !loadingData)?
                        <div className='w-full h-full flex flex-col items-center justify-center' >No DAOs Created yet</div>:null
                    }
                </div>
            </div>
        </div>


    );
}

export default DashboardMain;