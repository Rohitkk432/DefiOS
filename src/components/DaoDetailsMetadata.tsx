import React from 'react'

import Tags from './utils/Tags'
import IssueState from './utils/IssueState'

import {timeAgo} from '../utils/timeUtils'

import {ethers} from 'ethers'

interface DaoDetailsMetadataProps {
    metadata:any;
    DaoInfo:any;
    setPopupState: React.Dispatch<React.SetStateAction<string>>;
    setPopupIssue: React.Dispatch<React.SetStateAction<number>>;
}

const DaoDetailsMetadata: React.FC<DaoDetailsMetadataProps> = ({metadata,DaoInfo,setPopupState,setPopupIssue}) => {
    return (
        <div className='w-full min-h-[6vh] flex flex-row justify-start items-center bg-[#121418] rounded-md mb-[1%] pl-[1%] border border-[#5B5B5B] text-[1.7vh]'
        onClick={()=>{
            if(metadata.issueInfo.state===0){
                setPopupIssue(Number(metadata.contractIssueID));
                setPopupState('issueAction')
            }else if(metadata.issueInfo.state===1){
                setPopupIssue(Number(metadata.contractIssueID));
                setPopupState('issueVote')
            }else if(metadata.issueInfo.state===2){
                setPopupIssue(Number(metadata.contractIssueID));
                setPopupState('issueReward')
            }
        }}>
            <div className='w-[30%] h-full mx-[0.5%]'>
                {metadata.githubInfo.title} <IssueState issueState={metadata.issueInfo.state} />
            </div>
            <div className='w-[10%] h-full mx-[0.5%]'>{metadata.githubInfo.user.login}</div>
            <div className='w-[10%] h-full mx-[0.5%]'>{timeAgo(metadata.githubInfo.created_at)} ago</div>
            <div className='w-[35%] h-full mx-[0.5%] flex flex-row flex-wrap justify-start items-center'>
                {
                    metadata.githubInfo.labels.map((tag:any,idx:number)=>{
                        return <Tags tag={tag.name} key={idx} />
                    })
                }
            </div>
            <div className='w-[15%] h-full mx-[0.5%] flex flex-row justify-between items-center'>
                <div className='w-[40%]'>{parseInt(ethers.utils.formatEther(metadata.issueInfo.totalStaked))} {DaoInfo.metadata.tokenSymbol} </div>
                {/* <div className='w-[40%]'>({metadata.amountStakedInUSD})</div> */}
            </div>
            {/* <div className='w-[10%] h-full mx-[0.5%]'>
            </div> */}
        </div>
    )
}

export default DaoDetailsMetadata;