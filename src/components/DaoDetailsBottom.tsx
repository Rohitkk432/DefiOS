import React from 'react'
import {useState,useEffect,useMemo} from 'react'
import {SearchIcon} from '@heroicons/react/outline'
import {useSession} from 'next-auth/react'

import DaoDetailsMetadata from './DaoDetailsMetadata'
import DaoDetailsTop from './DaoDetailsTop'

// import data from '../config/daodetails.json';

import {ethers} from 'ethers'
declare let window:any
import DaoAbi from "./ContractFunctions/DaoABI.json"

interface DaoDetailsBottomProps {
    popupState:string;
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
    setPopupIssue: React.Dispatch<React.SetStateAction<number>>;
    setInlineTrigger: React.Dispatch<React.SetStateAction<number>>;
    DaoInfo:any;
    runTour:boolean;
    setRunTour: React.Dispatch<React.SetStateAction<boolean>>;
}

const DaoDetailsBottom: React.FC<DaoDetailsBottomProps> = ({popupState,setPopupState,DaoInfo,setPopupIssue,setRunTour,runTour,setInlineTrigger}) => {

    const [IssuesList,setIssuesList] = useState<any>()
    const {data:session} = useSession()

    const listAllIssues = async () => {
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let DaoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi , signer);

        const IssuesCount = await DaoContract.issueID();
        const issuesList = [];
        for (let i = 1; i <= IssuesCount; i++) {
            const issueRes = await DaoContract.repoIssues(i);
            const apiURL = issueRes.issueURL.replace('github.com','api.github.com/repos');
            const githubRes = await fetch(apiURL,{
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${session?.accessToken}` },
                    }).then(res=>res.json()).catch(err=>console.log(err));
            const collabCount = await DaoContract.getCollaboratorCount(i);
            const IterIssue = {
                collabCount:Number(collabCount),
                contractIssueID: i,
                issueInfo:issueRes,
                githubInfo: githubRes
            }
            issuesList.push(IterIssue);
        }
        setIssuesList(issuesList);
        // console.log(DaoInfo);
    }

    //search logic
    const [search, setSearch] = useState("");

    const IssueSearch = useMemo(() => {
        if (search==="") return IssuesList;
        return IssuesList.filter((_issue:any) => {
            return (
                _issue.githubInfo.title.toLowerCase().includes(search.toLowerCase()) || 
                _issue.githubInfo.user.login.toLowerCase().includes(search.toLowerCase())||
                _issue.githubInfo.html_url.split("/")[_issue.githubInfo.html_url.split("/").length - 1].toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [search,IssuesList]);

    useEffect(()=>{
        if(DaoInfo!==undefined){
            listAllIssues();
        }
    },[DaoInfo,popupState])

    return (
        <div className='w-[100%] h-[150vh] flex flex-col justify-between items-end px-[1%] py-[1%] relative text-white overflow-hidden'>
            <DaoDetailsTop setRunTour={setRunTour} runTour={runTour} DaoInfo={DaoInfo} />
            <div className='w-full h-[50%] px-[1.5%] py-[1.5%] bg-[#262B36] rounded-lg'>
                <div className='w-full flex flex-row justify-between items-center' >
                    {/* Search bar */}
                    <div className='h-[5vh] w-[80%] relative flex flex-row'>
                        <input type="text" className='w-full h-full rounded-md bg-[#121418] border border-[#3A4E70] text-[1.8vh] pl-[2%]' placeholder='Search Issues on the basis of name or metadata' value={search} onChange={(e) => setSearch(e.target.value)} />
                        <SearchIcon className='w-[2%] absolute top-[25%] right-[2%]' />
                    </div>
                    {/* create Dao btn */}
                    <button className='dao-details__step4 flex flex-row justify-center items-center h-[5vh] px-[1.5%] py-[1%] bg-[#91A8ED] rounded-md ml-[1%] text-[1.8vh] w-[32vh] font-semibold'
                    onClick={()=>{
                        setPopupState('newIssue')
                    }}>
                        Create New Issue
                    </button>
                </div>

                <div className='w-full h-[3vh] flex flex-row justify-start items-center mt-[2%] mb-[0.5%] pl-[1%] text-[#CACACA] text-[1.7vh] pr-[1%]'>
                    <div className='w-[33%] h-full mx-[0.5%]'>Title</div>
                    {/* <div className='w-[10%] h-full mx-[0.5%]'>Created at</div> */}
                    <div className='w-[35%] h-full mx-[0.5%]'>Tags</div>
                    <div className='w-[7%] h-full mx-[0.5%]'>Open PRs</div>
                    <div className='w-[15%] h-full mx-[0.5%]'>Amount Staked</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Pending Action</div>
                </div>
                <div className='w-full pr-[0.2%] h-[82%] overflow-y-scroll customScrollbar' >
                    {(IssueSearch && IssueSearch.length!==0 )&&
                        IssueSearch.map((dataVal:any, index:any) => {
                            return <DaoDetailsMetadata setInlineTrigger={setInlineTrigger} setPopupIssue={setPopupIssue} setPopupState={setPopupState} DaoInfo={DaoInfo} metadata={dataVal} key={index} first={index===0?true:false}/>
                        })
                    }
                    {(IssueSearch===undefined)&&
                        <div className='w-full h-full flex flex-row justify-center items-center'>
                            <svg aria-hidden="true" className="w-[4vh] h-[4vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <div className='text-[2.3vh] ml-[2vh]' >Loading Issues</div>
                        </div>
                    }
                    {(IssueSearch && IssueSearch.length===0) &&
                        <div className='w-full h-full flex flex-col items-center justify-center' >No Issues Created yet</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default DaoDetailsBottom;