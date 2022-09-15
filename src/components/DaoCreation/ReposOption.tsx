import React from 'react'

import {StarIcon, LinkIcon} from '@heroicons/react/outline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeFork } from '@fortawesome/free-solid-svg-icons';

interface ReposOptionProps {
    repo:any
    repoChoosen:string;
    setRepoChoosen:React.Dispatch<React.SetStateAction<string>>;
}

const ReposOption: React.FC<ReposOptionProps> = ({repo,repoChoosen,setRepoChoosen}) => {
    return (
        <div className='bg-[#121418] w-full h-[12vh] px-[2%] py-[2%] mt-[2%] text-xs font-semibold rounded-md border-[#2E2E2F] border relative' >
            {/* repo visibility */}
            <div className={`absolute top-[10%] right-[2%] border  rounded px-[4%] py-[0.5%] text-[1.15vh] text-[#B5C3DB] ${repo.visibility==="private"?'border-red-500':'border-[#3A4E70]'} `} >{repo.visibility}</div>
            {/* repo name */}
            <div className='flex flex-row'>
                <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='w-[2.5vh] h-[2.5vh] rounded-full'/>
                <div className={`ml-[1.5%] text-[#D7D7D7] text-[1.63vh]`}>{repo.full_name}</div>
            </div>
            {/* repo description */}
            <div className={`w-[90%] text-[1.2vh] h-[3vh] mt-[1.5%] text-[#BFBFBF]`}>
                {repo.description!==null ?(repo.description.length>156 ? repo.description.slice(0,150)+"..." : repo.description):""}
            </div>
            {/* repo stat info */}
            <div className={`flex flex-row mt-[1.5%] items-center text-[#B5C3DB] text-[1.63vh] `}>
                <StarIcon className='w-[1.5vh] h-[1.5vh] mr-[1%]'/>
                <div className='mr-[4%]'>{repo.stargazers_count}</div>
                <FontAwesomeIcon className='w-[1.5vh] h-[1.5vh] mr-[1%]' icon={faCodeFork} aria-hidden="true" />
                <div className='mr-[4%]'>{repo.forks_count}</div>
                <a href={repo.url} target="_blank">
                    <LinkIcon className='w-[1.5vh] h-[1.5vh] mr-[1%]'/>
                </a>
            </div>
            {/* repo choosen*/}
            <div className="w-[2.5vh] h-[2.5vh] absolute bottom-[10%] right-[2%]">
                <input type="radio" name="RepoForDAO" className='peer absolute opacity-0 w-full h-full cursor-pointer' value={repo.full_name} onChange={(e)=>{
                    if(e.target.checked){
                        setRepoChoosen(e.target.value);
                    }
                }} checked={(repo.full_name===repoChoosen)} />
                <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                flex justify-center items-center
                peer-checked:after:block
                after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
            </div>
        </div>
    );
}

export default ReposOption;