import React from 'react'
import {useState,useEffect} from 'react';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
// import {faArrowsRotate,faWallet,faSquarePollVertical} from '@fortawesome/free-solid-svg-icons'

import { useRouter }from 'next/router'

interface DaoMetadataProps {
    metadata:any
}

import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "./ContractFunctions/DaoABI.json"

const DaoMetadata: React.FC<DaoMetadataProps> = ({metadata}) => {
    const router = useRouter()
    const [openIssuesCount,setOpenIssuesCount] = useState<any>()
    const [totalStaked,setTotalStaked] = useState<any>()

    useEffect(()=>{
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(metadata.DAO, DaoAbi , signer);

        DaoContract.getOpenIssueCount().then((res:any)=>setOpenIssuesCount(Number(res)));
        DaoContract.TOTALSTAKED().then((res:any)=>setTotalStaked(parseInt(ethers.utils.formatEther(res))));
    },[])

    return (
        <div className='w-full min-h-[6vh] flex flex-row justify-start items-center bg-[#121418] rounded-md mb-[1%] pl-[1%] border border-[#5B5B5B] text-[1.7vh]'
        onClick={()=>{
            localStorage.setItem('popupState','closed');
            router.push(`/dao-details/${metadata.DaoId}`)
        }}>   
            <div className='w-[18%] mx-[0.5%]'>{metadata.metadata.daoName}</div>
            <div className='w-[20%] mx-[0.5%] flex flex-row items-center'>
                <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%] rounded-full' />
                <div>/ {metadata.metadata.repoName}</div>
            </div>


            {/* <div className={`w-[10%] mx-[0.5%]
            ${(metadata.role==='Repository Owner')?'text-blue-200':
            (metadata.role==='Issue Creator')?'text-blue-400':
            (metadata.role==='Stake Delegator')?'text-orange-500':
            (metadata.role==='Issue Solver')?'text-green-500':null}
            `}>{metadata.role}</div> */}
            
            {(metadata.owner.toLowerCase()===localStorage.getItem('currentAccount')?.toLowerCase())?<div className={`w-[10%] mx-[0.5%]
            text-blue-200`}>Repository Owner</div>:
            <div className={`w-[10%] mx-[0.5%]
            text-white`}>-</div>
            }
            

            <div className='w-[13%] mx-[0.5%]'>{metadata.metadata.creatorGithub}</div>
            <div className='w-[13%] mx-[0.5%] flex flex-row justify-start items-center'>
                <div className='w-[35%]'>{totalStaked} &nbsp; {metadata.metadata.tokenSymbol} </div>
                <img src={metadata.metadata.tokenImg||''} className='rounded-full h-[3vh] inline ml-[5%]' />  
                {/* <div className='w-[35%]'>({metadata.totalStakedInUSD})</div> */}
            </div>
            <div className='w-[6%] mx-[0.5%]'>{openIssuesCount} {parseInt(openIssuesCount)>10?"🔥":null}</div>

            <div className='w-[13%] h-[5.5vh] pl-[1%] mx-[0.5%] font-semibold flex flex-row justify-start items-center z-20'
            >-</div>

            {/* {(metadata?.pendingAction==='Sync Commit History')?
            <div className='w-[13.5%] h-[5.5vh] ml-[0.5%] cursor-pointer text-blue-200 font-semibold flex flex-row justify-start items-center z-20'
            onClick={(e)=>{
                e.stopPropagation()
                localStorage.setItem('popupState','issueAction');
                router.push('/dao-details')
            }}>
                <FontAwesomeIcon icon={faArrowsRotate} className='inline h-[2vh] mr-[3%]'/>
                {metadata?.pendingAction}
            </div>:
            (metadata?.pendingAction==='Vote on Solution')?
            <div className='w-[13.5%] h-[5.5vh] ml-[0.5%] cursor-pointer text-orange-500 font-semibold flex flex-row justify-start items-center z-20'
            onClick={(e)=>{
                e.stopPropagation();
                localStorage.setItem('popupState','issueVote');
                router.push('/dao-details')
            }}>
                <FontAwesomeIcon icon={faSquarePollVertical} className='inline h-[2vh] mr-[3%]'/>
                {metadata?.pendingAction}
            </div>:
            (metadata?.pendingAction==='Claim Rewards')?
            <div className='w-[13.5%] h-[5.5vh] ml-[0.5%] cursor-pointer text-green-500 font-semibold flex flex-row justify-start items-center z-20'
            onClick={(e)=>{
                e.stopPropagation()
                localStorage.setItem('popupState','issueReward');
                router.push('/dao-details')
            }}>
                <FontAwesomeIcon icon={faWallet} className='inline h-[2vh] mr-[3%]'/>{metadata?.pendingAction}
            </div>
            :null
            } */}
        </div>
    );
}

export default DaoMetadata;