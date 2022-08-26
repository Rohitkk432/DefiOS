import React from 'react'

interface TagsProps {
    tag:string
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

export default Tags;