import React from 'react'
import {XIcon} from '@heroicons/react/outline'

interface TagsProps {
    tag:string;
    assign?:Boolean;
    allTags?: string[];
    setAllTags?: React.Dispatch<React.SetStateAction<string[]>>;
}

const Tags: React.FC<TagsProps> = ({tag,assign,allTags,setAllTags})=>{
    return (
        <>
            {
                (tag==="bug")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#CD9CA6] bg-[#321820] text-[#CD9CA6] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    bug
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:
                (tag==="documentation")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#148DFF] bg-[#0B2337] text-[#148DFF] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    documentation
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:
                (tag==="duplicate")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#CDD1D5] bg-[#30343A] text-[#CDD1D5] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    duplicate
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:
                (tag==="enhancement")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#A0EEEE] bg-[#28393E] text-[#A0EEEE] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    enhancement
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:
                (tag==="good first issue")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#C1B8E0] bg-[#1F1E41] text-[#C1B8E0] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    good first issue
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:
                (tag==="help wanted")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#00E6BA] bg-[#0B2628] text-[#00E6BA] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    help wanted
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:
                (tag==="invalid")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#E5E562] bg-[#343726] text-[#E5E562] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    invalid
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:
                (tag==="question")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#D97EE0] bg-[#0D1117] text-[#D97EE0] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    question
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:
                (tag==="urgent")?
                <div className='rounded-full py-[1%] px-[4%] mx-[1%] my-[2%] text-[1.5vh] inline border border-[#F093B2] bg-[#351B29] text-[#F093B2] font-bold flex flex-row items-center justify-center' 
                onClick={()=>{
                    if(assign){
                        if(setAllTags && allTags){
                            setAllTags(allTags.filter(t=>t!==tag))
                        }
                    }
                }}>
                    urgent
                    {assign?
                        <XIcon className='h-[2.2vh] ml-[2%]' />:null
                    }
                </div>:null
            }
        </>
    )
}

export default Tags;