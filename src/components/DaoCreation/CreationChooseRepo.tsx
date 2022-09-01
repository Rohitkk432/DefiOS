import React from 'react'
import {useState,useEffect,useMemo} from 'react'
import { useRouter } from 'next/router';

import ReposOption from './ReposOption';

import { SearchIcon } from '@heroicons/react/outline';

interface CreationChooseRepoProps {
}

const CreationChooseRepo: React.FC<CreationChooseRepoProps> = ({}) => {
    const router = useRouter()

    const [repos,setRepos] = useState([]);
    const [isLoading,setIsLoading] = useState(true);

    const [repoChoosen,setRepoChoosen] = useState('');
    const [errorMsg,setErrorMsg] = useState(false);

    //search logic
    const [search, setSearch] = useState("");

    const repoSearch = useMemo(() => {
        if (search==="") return repos;
        return repos.filter((_repo:any) => {
            return (
                _repo.name.toLowerCase().includes(search.toLowerCase()) || 
                _repo.fullname === repoChoosen
            );
        });
    }, [search,repos]);


    useEffect(() => {
        fetch(`/api/getreposbyuser`).then(res => res.json()).then(data => {
            setRepos(data);
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
        })
    },[])

    const submitPage = ()=>{
        const data = {
            "repoFullName": repoChoosen,
        }
        localStorage.setItem('DaoCreationData',JSON.stringify(data))
        router.push('/creation/2')
    }

    return (
        <div 
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between customGradient'
        >
            <div className='flex flex-col justify-start items-center h-[90%] w-full relative' >

                {/* Search feild */}
                <input name='repoSearch' type="text" className={`bg-[#121418] w-full py-[2%] px-[4%] text-[1.63vh] font-semibold rounded-md border-[#3A4E70] border`} placeholder='Search repositories' value={search}
                onChange={(e) => setSearch(e.target.value)}/>
                <SearchIcon className='w-[5%] absolute top-[1.5%] right-[3%]' />

                {/* Repositories */}
                <div className='flex flex-col justify-start items-center h-[100%] w-full relative overflow-y-scroll overflow-x-hidden customScrollbar'>
                    {!isLoading?
                        repoSearch?.map((repo:any,idx:any) => (
                            <ReposOption repo={repo} key={idx} repoChoosen={repoChoosen} setRepoChoosen={setRepoChoosen}  />
                        ))
                        : <div className='m-auto'>Loading...</div>
                    }
                </div>
            </div>

            {/* Submit Btn */}
            <button onClick={()=>{
                if(repoChoosen===''){
                    setErrorMsg(true)
                    return
                }
                submitPage()
            }} className={`bg-[#91A8ED] w-full py-[2%] text-[1.63vh] ${errorMsg?'border-red-500 border-b-2 text-black':null} font-semibold rounded-md`} >
                Choose Repository
            </button>
        </div>
    );
}

export default CreationChooseRepo;