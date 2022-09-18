import React from 'react'
import {useState,useEffect,useMemo} from 'react'
import {SearchIcon} from '@heroicons/react/outline'

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
    DaoInfo:any;
}

const DaoDetailsBottom: React.FC<DaoDetailsBottomProps> = ({popupState,setPopupState,DaoInfo,setPopupIssue}) => {

    const [IssuesList,setIssuesList] = useState<any>()

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
            const githubRes = await fetch(apiURL).then(res=>res.json()).catch(err=>console.log(err));
            const IterIssue = {
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
            <DaoDetailsTop DaoInfo={DaoInfo} />
            <div className='w-full h-[50%] px-[1.5%] py-[1.5%] bg-[#262B36] rounded-lg'>
                <div className='w-full flex flex-row justify-between items-center' >
                    {/* Search bar */}
                    <div className='h-[5vh] w-[80%] relative flex flex-row'>
                        <input type="text" className='w-full h-full rounded-md bg-[#121418] border border-[#3A4E70] text-[1.8vh] pl-[2%]' placeholder='Search Issues on the basis of name or metadata' value={search} onChange={(e) => setSearch(e.target.value)} />
                        <SearchIcon className='w-[2%] absolute top-[25%] right-[2%]' />
                    </div>
                    {/* create Dao btn */}
                    <button className='flex flex-row justify-center items-center h-[5vh] px-[1.5%] py-[1%] bg-[#91A8ED] rounded-md ml-[1%] text-[1.8vh] px-[5%] font-semibold'
                    onClick={()=>{
                        setPopupState('newIssue')
                    }}>
                        Create New Issue
                    </button>
                </div>

                <div className='w-full h-[3vh] flex flex-row justify-start items-center mt-[2%] mb-[0.5%] pl-[1%] text-[#CACACA] text-[1.7vh] pr-[1%]'>
                    <div className='w-[30%] h-full mx-[0.5%]'>Title</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Created by</div>
                    <div className='w-[10%] h-full mx-[0.5%]'>Created at</div>
                    <div className='w-[35%] h-full mx-[0.5%]'>Tags</div>
                    <div className='w-[15%] h-full mx-[0.5%]'>Amount Staked</div>
                    {/* <div className='w-[10%] h-full mx-[0.5%]'>Top Staker</div> */}
                </div>
                <div className='w-full pr-[0.2%] h-[82%] overflow-y-scroll customScrollbar' >
                    {(IssueSearch && IssueSearch.length!==0 )?
                        IssueSearch.map((dataVal:any, index:any) => {
                            return <DaoDetailsMetadata setPopupIssue={setPopupIssue} setPopupState={setPopupState} DaoInfo={DaoInfo} metadata={dataVal} key={index}/>
                        }):(IssueSearch===undefined)?
                        <div className='w-full h-full flex flex-col items-center justify-center' >Loading...</div>:(IssueSearch && IssueSearch.length===0)?
                        <div className='w-full h-full flex flex-col items-center justify-center' >No Issues Created yet</div>:null
                    }
                </div>
            </div>
        </div>
    );
}

export default DaoDetailsBottom;