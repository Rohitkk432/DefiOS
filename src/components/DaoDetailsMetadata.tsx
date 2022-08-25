import React from 'react'

interface DaoDetailsMetadataProps {
    metadata:any
}
interface TagsProps {
    tag:string
}
interface IssueStateProps {
    issueState:string
}

const Tags: React.FC<TagsProps> = ({tag})=>{
    return (
        <>
            {
                (tag==="bug")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#CD9CA6] bg-[#321820] text-[#CD9CA6] font-bold' >bug</div>:
                (tag==="documentation")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#148DFF] bg-[#0B2337] text-[#148DFF] font-bold' >documentation</div>:
                (tag==="duplicate")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#CDD1D5] bg-[#30343A] text-[#CDD1D5] font-bold' >duplicate</div>:
                (tag==="enhancement")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#A0EEEE] bg-[#28393E] text-[#A0EEEE] font-bold' >enhancement</div>:
                (tag==="good first issue")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#C1B8E0] bg-[#1F1E41] text-[#C1B8E0] font-bold' >good first issue</div>:
                (tag==="help wanted")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#00E6BA] bg-[#0B2628] text-[#00E6BA] font-bold' >help wanted</div>:
                (tag==="invalid")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#E5E562] bg-[#343726] text-[#E5E562] font-bold' >invalid</div>:
                (tag==="question")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#D97EE0] bg-[#0D1117] text-[#D97EE0] font-bold' >question</div>:
                (tag==="urgent")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#F093B2] bg-[#351B29] text-[#F093B2] font-bold' >urgent</div>:null
            }
        </>
    )
}

const IssueState: React.FC<IssueStateProps> = ({issueState})=>{
    return (
        <>
            {
                (issueState==="open")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-blue-400 bg-blue-900 text-blue-400 font-bold' >open</div>:
                (issueState==="closed")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-green-500 bg-green-900 text-green-400 font-bold' >closed</div>:
                (issueState==="voting")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-orange-500 bg-orange-900 text-orange-400 font-bold' >voting</div>:null
            }
        </>
    )
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