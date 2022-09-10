import React from 'react'
import {useState,useEffect} from 'react'
import LoadingScreen from '../utils/LoadingScreen';

import { XIcon } from '@heroicons/react/outline';

import Tags from '../utils/Tags'
import IssueState from '../utils/IssueState'

import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "../ContractFunctions/DaoABI.json"

import {timeAgo} from '../../utils/timeUtils'

interface IssueRewardProps {
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
    DaoInfo: any;
    popupIssueID: number;
}

const IssueReward: React.FC<IssueRewardProps> = ({setPopupState,DaoInfo,popupIssueID}) => {

    const [load, setLoad] = useState(false)

    const [IssuesList,setIssuesList] = useState<any>()

    const getTheIssue = async () => {
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        //metadata of DAO
        const DaoMetadata = await DaoContract.METADATA();
        const DaoRes = await fetch(`https://gateway.ipfs.io/ipfs/${DaoMetadata}`).then(res=>res.json());
        DaoRes.tokenImg = `https://gateway.ipfs.io/ipfs/${DaoRes.tokenImg}`

        //issue info
        const issueRes = await DaoContract.repoIssues(popupIssueID);

        //get PR/collaboration info
        let solverInfo:any = {} ;
        const CollabCount = await DaoContract.getCollaboratorCount(popupIssueID);
        for(let i=0;i<CollabCount;i++){
            const _info:any = {}
            const CollabInfo = await DaoContract.collaborators(popupIssueID,i);
            const _linkbreak = CollabInfo.url.split("/");
            const getPr = await fetch(`https://api.github.com/repos/${_linkbreak[3]}/${_linkbreak[4]}/pulls/${_linkbreak[6]}`).then(res => res.json());
            _info.collabID = i;
            _info.url = CollabInfo.url;
            _info.collaborator = CollabInfo.collaborator;
            _info.votes = CollabInfo.votes;
            _info.prDetails = getPr;
            
            if(CollabInfo.collaborator.toLowerCase() === issueRes.solver.toLowerCase()){
                solverInfo = _info;
            }
        }

        const apiURL = issueRes.issueURL.replace('github.com','api.github.com/repos');
        const githubRes = await fetch(apiURL).then(res=>res.json()).catch(err=>console.log(err));
        const IterIssue = {
            issueInfo:issueRes,
            githubInfo: githubRes,
            daoInfo: DaoRes,
            solverInfo: solverInfo
        }
        // console.log(IterIssue)
        setIssuesList(IterIssue);
    }

    const RedeemRewardsFunc = async () => {
        setLoad(true);
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        await DaoContract.redeemRewards(popupIssueID);
        setLoad(false);
        setPopupState('none')
        localStorage.removeItem('popupState')
    }

    useEffect(()=>{
        if(DaoInfo!==undefined && popupIssueID!==0){
            getTheIssue();
        }
    },[DaoInfo,popupIssueID])

    return (
        <div className='w-full h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-20 
        flex items-center justify-center text-white' >
            <div className='w-[70vw] h-[75vh] bg-[#262B36] rounded-md 
            shadow-[0_4vh_4vh_5vh_rgba(0,0,0,0.3)] 
            flex flex-row items-center justify-between py-[1%] px-[1.5%]' >

                <div className='w-[66%] h-full flex flex-col justify-start items-start'>
                    <div className='flex flex-row items-center w-full flex-wrap text-[3.5vh] font-semibold' >
                        {IssuesList!==undefined && IssuesList.githubInfo.title}
                        <IssueState issueState='winner chosen' />
                    </div>
                    <div className='flex flex-row justify-between items-center w-full flex-wrap text-[2.5vh]' >
                        <div className='w-[45%] flex flex-row'>
                            <div className='' >Created by :</div> 
                            <div className=' ml-[2%] rounded-full text-gray-300 flex flex-row items-center' >
                                <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                                <div>/{IssuesList!==undefined && IssuesList.githubInfo.user.login}</div>
                            </div>
                        </div>
                        <div className='w-[45%] flex flex-row'>
                            <div className=' ml-[2%]' >Created at :</div> 
                            <div className=' ml-[2%] rounded-full text-gray-300' >
                                {IssuesList!==undefined && timeAgo(IssuesList.githubInfo.created_at)} ago
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-center w-full flex-wrap' >
                        <div className='text-[2.5vh]' >Tags :</div> 
                        {IssuesList!==undefined &&
                            IssuesList.githubInfo.labels.map((tag:any,idx:number)=>{
                                return <Tags tag={tag.name} key={idx} />
                            })
                        }
                    </div>
                    <div className='flex flex-row items-center w-full flex-wrap text-[2.5vh]' >
                        <div>Issue Url :</div> 
                        <a href={IssuesList!==undefined ? IssuesList.issueInfo.issueURL:''} target="_blank" className='ml-[2%] text-gray-300 flex flex-row items-center w-[80%]' >
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh]' />
                            <div>{IssuesList!==undefined && IssuesList.issueInfo.issueURL.replace("https://github.com","")}</div>
                        </a>
                    </div>

                    <div className='w-full h-full overflow-y-scroll border border-white 
                    p-[2.2%] mt-[4%] rounded-[2vh] customScrollbar text-[2.3vh]'>
                        {IssuesList!==undefined && IssuesList.githubInfo.body}
                    </div>

                </div>
                <div className='w-[32%] h-full flex flex-col justify-start items-end'>
                    <XIcon className='h-[4vh] mb-[4%]' 
                    onClick={()=>{
                        setPopupState('none')
                        localStorage.removeItem('popupState')
                    }}/>
                    <div className='w-full h-[91%] bg-gray-600 flex flex-col items-start justify-start 
                    py-[4%] px-[3%] rounded-[1vh] text-[2.5vh]' >
                        <img src="/assets/images/Reward-illustration.svg" className='h-[40%] my-[3%] mx-auto' />
                        <div className='flex flex-row justify-center items-center border-2 border-[#91A8ED] w-full py-[2.5%] rounded-[1vh] mb-[3%] mt-[10%] text-[2.7vh]'>
                            <img src={IssuesList!==undefined ? IssuesList.daoInfo.tokenImg : ''}  className='w-[4.5vh] h-[4.5vh] mr-[3%]' />
                            <div>{IssuesList!==undefined && parseInt(ethers.utils.formatEther(IssuesList.issueInfo.totalStaked))} {IssuesList!==undefined && IssuesList.daoInfo.tokenSymbol}</div>
                        </div>
                        <div className='flex flex-row w-full items-center mt-[2%]'>
                            <div className='text-[2.5vh]'>Winning Author:</div>
                            <div className='ml-[3%] text-[2.3vh]' >{IssuesList!==undefined && `${IssuesList.issueInfo.solver.slice(0,5)}...${IssuesList.issueInfo.solver.slice(37,42)}`}</div>
                        </div>
                        <div className='flex flex-row w-full items-center mt-[2%] flex-wrap'>
                            <div className='text-[2.5vh]'>Winning PR:</div>
                            <div className='flex flex-row items-center w-[70%]'>
                                <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.3vh] ml-[3%]' />
                                <div className=' text-[2vh]'>{IssuesList!==undefined && 
                                `${IssuesList.solverInfo.url.replace('https://github.com','').length>25 ? IssuesList.solverInfo.url.replace('https://github.com','').slice(0,25)+'...' : IssuesList.solverInfo.url.replace('https://github.com','')}`
                                }</div>
                            </div>
                        </div>
                        {IssuesList!==undefined && localStorage.getItem('currentAccount')!==null
                        && localStorage.getItem('currentAccount')!==undefined && IssuesList.issueInfo.solver.toLowerCase()===localStorage.getItem('currentAccount')?.toLocaleLowerCase() &&
                        <button className='flex flex-row justify-center items-center bg-[#91A8ED] 
                        w-full py-[2.5%] rounded-[1vh] mt-[10%] text-[2.7vh]'
                        onClick={RedeemRewardsFunc}>🎉 Claim Reward 🎉</button>
                        }
                    </div>
                </div>
            </div>
            <LoadingScreen load={load} />
        </div>
    );
}

export default IssueReward;