import React from 'react'
import {useState,useEffect,useMemo} from 'react'
import { useRouter } from 'next/router';

import {useSession} from 'next-auth/react'

import ReposOption from './ReposOption';

import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

import {ethers} from 'ethers'
import { Contract as MultiContract, Provider, setMulticallAddress } from "ethers-multicall";
import contractAbi from "../ContractFunctions/DaoFactoryABI.json"
declare let window:any

interface CreationChooseRepoProps {
    tourSteps:any;
    setTourSteps:any;
}

const CreationChooseRepo: React.FC<CreationChooseRepoProps> = ({setTourSteps}) => {
    const router = useRouter()
    const {data:session} = useSession()
    const contractAddress:any = process.env.NEXT_PUBLIC_DEFIOS_CONTRACT_ADDRESS;

    const StepsForTour = [
        {
            target: '.demo__step1',
            content: 'Follow these 4 simple steps to create a DAO',
            placement: 'right',
            offset: 0,
        },
        {
            target: '.demo__step2',
            content: 'Choose from repositories that you own, or repositories of organizations with ownership access',
            placement: 'left-start',
            offset: 0,
        },
        {
            target: '.demo__step3',
            content: 'Analyze the token ownership split across different contributors',
            placement: 'left',
            offset: 0,
        }
    ]

    //data of repos
    const [repos,setRepos] = useState<any>([]);
    const [orgRepos,setOrgRepos] = useState<any>([]);
    const [collaboratorRepos,setCollaboratorRepos] = useState<any>([]);

    //expanders
    const [expandRepos,setExpandRepos] = useState<boolean>(true);
    const [expandOrg,setExpandOrg] = useState<boolean>(false);
    const [expandCollaborator,setExpandCollaborator] = useState<boolean>(false);

    const [isLoading,setIsLoading] = useState(true);

    const [repoChoosen,setRepoChoosen] = useState('');
    const [errorMsg,setErrorMsg] = useState(false);
    const [submitPage,setSubmitPage] = useState(false);

    const FetchRepos = async() =>{

        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        // let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        //multi-call
        setMulticallAddress(245022926,process.env.NEXT_PUBLIC_MULTI_CALL_ADDRESS||"");
        const ethcallProvider = new Provider(provider, 245022926);
        let defiosContract:MultiContract  = new MultiContract(contractAddress, contractAbi);

        let affiliation = 'owner';
        let keepGoing = true;
        let pagination = 1;
        let _repos:any = [];
        while(keepGoing){
            const res = await fetch(`https://api.github.com/user/repos?affiliation=${affiliation}&sort=pushed&per_page=100&page=${pagination}`,{
                method:"GET",
                headers:{
                    "Authorization":`token ${session?.accessToken}`,
                    "Accept":"application/vnd.github.v3+json"
                }
            }).then(res => res.json()).catch(err => console.log(err));

            let callsArray:any = [];
            let createdCheckIds:any = []

            for (let i=0;i<res.length;i++) {
                callsArray.push(await defiosContract.daoExists((res[i].id).toString()));
            }
            if(callsArray.length > 0){
                const multiRes = await ethcallProvider.all(callsArray)
                createdCheckIds = multiRes;
            }
            const refinedRes = res.filter((repo:any,idx:number) =>
                repo.permissions.admin && !createdCheckIds[idx]
            );

            if(refinedRes.length === 0 && affiliation === 'owner'){
                affiliation = 'collaborator';
                pagination = 1;
                _repos=[]
            }else if(refinedRes.length === 0 && affiliation === 'collaborator'){
                affiliation = 'organization_member';
                pagination = 1;
                _repos=[]
            }else if(refinedRes.length === 0 && affiliation === 'organization_member'){
                keepGoing = false;
            }else if(affiliation === 'owner'){
                _repos = [..._repos,...refinedRes];
                setRepos(_repos);
                setIsLoading(false);
                pagination++;
            }else if(affiliation === 'collaborator'){
                _repos = [..._repos,...refinedRes];
                setCollaboratorRepos(_repos);
                setIsLoading(false);
                pagination++;
            }else if(affiliation === 'organization_member'){
                _repos = [..._repos,...refinedRes];
                setOrgRepos(_repos);
                setIsLoading(false);
                pagination++;
            }
        }
    }

    //search logic
    const [search, setSearch] = useState("");

    const repoSearch = useMemo(() => {
        if (search==="") return {
            repos:repos,
            orgRepos:orgRepos,
            collaboratorRepos:collaboratorRepos
        };
        const filteredRepos = repos.filter((_repo:any) => {
            return (
                _repo.name.toLowerCase().includes(search.toLowerCase()) || 
                _repo.full_name === repoChoosen
            );
        });
        const filteredOrgRepos = orgRepos.filter((_repo:any) => {
            return (
                _repo.name.toLowerCase().includes(search.toLowerCase()) || 
                _repo.full_name === repoChoosen
            );
        });
        const filteredCollabRepos = collaboratorRepos.filter((_repo:any) => {
            return (
                _repo.name.toLowerCase().includes(search.toLowerCase()) || 
                _repo.full_name === repoChoosen
            );
        });
        if(filteredRepos.length !==0 ) setExpandRepos(true);
        if(filteredOrgRepos.length !==0 ) setExpandOrg(true);
        if(filteredCollabRepos.length !==0 ) setExpandCollaborator(true);
        return {
            repos:filteredRepos,
            orgRepos:filteredOrgRepos,
            collaboratorRepos:filteredCollabRepos
        };
    }, [search,repos,orgRepos,collaboratorRepos]);


    useEffect(() => {
        setTourSteps(StepsForTour);
        if(session){
            FetchRepos();
        }
    },[session])

    const handlePageSubmit = ()=>{
        const data = {
            "repoFullName": repoChoosen,
        }
        localStorage.setItem('DaoCreationData',JSON.stringify(data))
        router.push('/creation/2')
    }

    return (
        <div 
        className='demo__step2 w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between customGradient'
        >
            <div className='flex flex-col justify-start items-center h-[90%] w-full relative' >
                
                {/* Search feild */}
                <input name='repoSearch' type="text" className={`bg-[#121418] w-full py-[2%] px-[4%] text-[1.63vh] font-semibold rounded-md border-[#3A4E70] border mb-[2%]`} placeholder='Search repositories' value={search}
                onChange={(e) => setSearch(e.target.value)}/>
                <SearchIcon className='w-[5%] absolute top-[1.5%] right-[3%]' />

                {/* Repositories */}
                <div className='flex flex-col justify-start items-center h-[100%] w-full relative overflow-y-scroll overflow-x-hidden customScrollbar'>
                    
                    {/* organization repos */}
                    {repoSearch.orgRepos.length > 0 && !isLoading &&
                    <div className='w-full flex flex-row justify-between items-center px-[5%] py-[2%] text-[1.8vh] mt-[2%] rounded-[1.5vh] bg-[#1A1F25]'
                    onClick={()=>setExpandOrg(!expandOrg)} >
                        <div>Organization</div>
                        {expandOrg ? <ChevronUpIcon className='w-[2vh]'/> 
                        : <ChevronDownIcon className='w-[2vh]'/>}
                    </div>}
                    {expandOrg && !isLoading && repoSearch.orgRepos.map((repo:any,idx:number)=>(
                        <ReposOption repo={repo} key={idx} repoChoosen={repoChoosen} setRepoChoosen={setRepoChoosen}  />
                    ))}
                    {/* collaborator repos */}
                    {repoSearch.collaboratorRepos.length > 0 && !isLoading &&
                    <div className='w-full flex flex-row justify-between items-center px-[5%] py-[2%] text-[1.8vh] mt-[2%] rounded-[1.5vh] bg-[#1A1F25]' 
                    onClick={()=>setExpandCollaborator(!expandCollaborator)} >
                        <div>Collaborator</div>
                        {expandCollaborator ? <ChevronUpIcon className='w-[2vh]'/> 
                        : <ChevronDownIcon className='w-[2vh]'/>}
                    </div>}
                    {expandCollaborator && !isLoading && repoSearch.collaboratorRepos.map((repo:any,idx:number)=>(
                        <ReposOption repo={repo} key={idx} repoChoosen={repoChoosen} setRepoChoosen={setRepoChoosen}  />
                    ))}
                    {/* owner repos */}
                    {repoSearch.repos.length > 0 && !isLoading &&
                    <div className='w-full flex flex-row justify-between items-center px-[5%] py-[2%] text-[1.8vh] mt-[2%] rounded-[1.5vh] bg-[#1A1F25]' 
                    onClick={()=>setExpandRepos(!expandRepos)} >
                        <div>Owner</div>
                        {expandRepos ? <ChevronUpIcon className='w-[2vh]'/> 
                        : <ChevronDownIcon className='w-[2vh]'/>}
                    </div>}
                    {expandRepos && !isLoading && repoSearch.repos.map((repo:any,idx:number)=>(
                        <ReposOption repo={repo} key={idx} repoChoosen={repoChoosen} setRepoChoosen={setRepoChoosen}  />
                    ))}

                    {isLoading && 
                    <div className='w-full h-full flex flex-col justify-center items-center'>
                        <svg aria-hidden="true" className="w-[5vh] h-[5vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <div className='text-[2.5vh] mt-[1vh]' >Loading</div>
                    </div>
                    }
                </div>
            </div>

            {/* Submit Btn */}
            <button onClick={()=>{
                if(repoChoosen===''){
                    setErrorMsg(true)
                    return
                }
                if(!submitPage){
                    setSubmitPage(true)
                    handlePageSubmit()
                }
            }} className={`${submitPage?"bg-gray-600":"bg-[#91A8ED]"} w-full py-[2%] text-[1.63vh] ${errorMsg?'border-red-500 border-b-2 text-black':null} font-semibold rounded-md`} >
                Choose Repository
            </button>
        </div>
    );
}

export default CreationChooseRepo;