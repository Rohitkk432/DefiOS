import React from 'react'

import Tags from './utils/Tags'
import IssueState from './utils/IssueState'


interface DaoDetailsMetadataProps {
    metadata:any
}

const DaoDetailsMetadata: React.FC<DaoDetailsMetadataProps> = ({metadata}) => {
    return (
        <div className='w-full min-h-[6vh] flex flex-row justify-start items-center bg-[#121418] rounded-md mb-[1%] pl-[1%] border border-[#5B5B5B] text-[1.7vh]'>
            <div className='w-[30%] h-full mx-[0.5%]'>
                {metadata.title} <IssueState issueState={metadata.state} />
            </div>
            <div className='w-[10%] h-full mx-[0.5%]'>{metadata.createdBy}</div>
            <div className='w-[10%] h-full mx-[0.5%]'>{metadata.createdAt}</div>
            <div className='w-[30%] h-full mx-[0.5%] flex flex-row flex-wrap justify-start items-center'>
                {
                    metadata.tags.map((tag:string,idx:number)=>{
                        return <Tags tag={tag} key={idx} />
                    })
                }
            </div>
            <div className='w-[10%] h-full mx-[0.5%] flex flex-row justify-between items-center'>
                <div className='w-[40%]'>{metadata.amountStaked} </div>
                <div className='w-[40%]'>({metadata.amountStakedInUSD})</div>
            </div>
            <div className='w-[10%] h-full mx-[0.5%]'>{metadata.topStaker}</div>
        </div>
    )
}

export default DaoDetailsMetadata;