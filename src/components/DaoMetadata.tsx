import React from 'react'

interface DaoMetadataProps {
    metadata:any
}

const DaoMetadata: React.FC<DaoMetadataProps> = ({metadata}) => {
    return (
        <div className='w-full min-h-[6vh] flex flex-row justify-start items-center bg-[#121418] rounded-md mb-[1%] pl-[1%] border border-[#5B5B5B] text-[1.7vh]'>
            <div className='w-[18%] mx-[0.5%]'>{metadata.daoName}</div>
            <div className='w-[20%] mx-[0.5%]'>{metadata.source} : {metadata.repoName}</div>

            <div className={`w-[10%] mx-[0.5%]
            ${(metadata.role==='Repository Owner')?'text-blue-200':
            (metadata.role==='Issue Creator')?'text-blue-400':
            (metadata.role==='Stake Delegator')?'text-orange-500':
            (metadata.role==='Issue Solver')?'text-green-500':null}
            `}>{metadata.role}</div>

            <div className='w-[13%] mx-[0.5%]'>{metadata.createdBy}</div>
            <div className='w-[13%] mx-[0.5%] flex flex-row justify-between items-center'>
                <div className='w-[35%]'>{metadata.totalStaked} </div>
                <img src={metadata.tokenImgUrl} className='h-[3vh] inline mx-[2%]' />  
                <div className='w-[35%]'>({metadata.totalStakedInUSD})</div>
            </div>
            <div className='w-[6%] mx-[0.5%] pl-[2%]'>{metadata.openIssues}</div>

            {(metadata.pendingAction==='Sync Commit History')?
            <button className='w-[13.5%] h-[5.5vh] ml-[0.5%] rounded-md bg-blue-200 text-black font-semibold flex justify-center  items-center'>{metadata.pendingAction}</button>:
            (metadata.pendingAction==='Vote on Solution')?
            <button className='w-[13.5%] h-[5.5vh] ml-[0.5%] rounded-md bg-orange-500 text-black font-semibold flex justify-center  items-center'>{metadata.pendingAction}</button>:
            (metadata.pendingAction==='Claim Rewards')?
            <button className='w-[13.5%] h-[5.5vh] ml-[0.5%] rounded-md bg-green-500 text-black font-semibold flex justify-center items-center'>{metadata.pendingAction}</button>:null
            }
        </div>
    );
}

export default DaoMetadata;