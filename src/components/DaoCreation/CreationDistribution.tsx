import React from 'react'
import {useState,useEffect,useMemo} from 'react'
import {ethers} from 'ethers'
import {useSession} from 'next-auth/react'

import { useRouter } from 'next/router';
import UserOptions from './UserOptions';
import { InformationCircleIcon , SearchIcon , CheckIcon, PencilIcon } from '@heroicons/react/outline';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import { CodeContributorStats,OptionRepoOwner,CodeDurationStats } from '../../utils/contributorStats';

interface CreationDistributionProps {
    triggerToMain:number;
    setTriggerToMain:React.Dispatch<React.SetStateAction<number>>;
}

declare let window:any

const CreationDistribution: React.FC<CreationDistributionProps> = ({triggerToMain,setTriggerToMain}) => {
    const chainId = 245022926 // remote proxy — solana devnet

    const router = useRouter();
    const {data:session} = useSession()

    const [DaoFees,setDaoFees] = useState('');
    const [distributionPercentage,setDistributionPercentage] = useState('');
    const [MainDistribution,setMainDistribution] = useState('0');

    const [algorithm,setAlgorithm] = useState('');
    const [network,setNetwork] = useState('');
    const [errorMsg,setErrorMsg] = useState('');

    const [contributors,setContributors] = useState<any>([]);
    const [isLoading,setIsLoading]=useState(true);

    const [editDistribution,setEditDistribution] = useState(true);

    const [submitPage,setSubmitPage] = useState(false);

    const [daoCreator,setDaoCreator] = useState('');

    const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            borderRadius: '1vh',
            fontSize: '2vh',
            padding:'1vh',
            maxWidth: '20vw',
        },
    }));

    const FetchContributors = async()=>{
        let repoFullName = ''
        if(localStorage.getItem('DaoCreationData')){
            const storageData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
            repoFullName = storageData.repoFullName;
        }

        const data = await fetch(`https://api.github.com/repos/${repoFullName}/stats/contributors`,{
            method:"GET",
            headers:{
                "Authorization":`token ${session?.accessToken}`,
                "Accept":"application/vnd.github.v3+json"
            }
        }).then(res=>res.json()).catch(err => console.log(err));

        const myInfo = await fetch(`https://api.github.com/user`,{
            method:"GET",
            headers:{
                "Authorization":`token ${session?.accessToken}`,
                "Accept":"application/vnd.github.v3+json"
            }
        }).then(res=>res.json()).catch(err => console.log(err));

        setContributors(data);

        if(Object.keys(data).length===0) return;

        setTriggerToMain(triggerToMain+1);

        let isContributor = false;
        let isCollaborator = false;
        for(let i=0;i<data.length;i++){
            if(data[i].author.login === repoFullName.split('/')[0]){
                isCollaborator = true;
                if(isContributor){
                    break;
                }
            }
            if(data[i].author.login === myInfo.login){
                isContributor = true
                if(isCollaborator){
                    break;
                }
            }
        }
        if(!isContributor){
            const weekData = [];
            for(let i=0;i<data[0].weeks.length;i++){
                const _data = data[0].weeks[i];
                _data.c=0;
                _data.a=0;
                _data.d=0;
                weekData.push(_data);
            }
            data.push({
                total:0,
                weeks:weekData,
                author:{
                    login:myInfo.login,
                    id:myInfo.id,
                    avatar_url:myInfo.avatar_url,
                }
            })
            if(!isCollaborator){ 
                setDaoCreator(myInfo.login);
            }
        }

        setContributors(data);
        setIsLoading(false);

        const distributionInit:any = {}
        data.forEach((el:any) => {
            const contri = el.author.login
            distributionInit[`${contri}`] = '0%';
        })
        localStorage.setItem('distributionOk','true');
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const newData = {...oldData,distribution:distributionInit}
        if(oldData.distribution===undefined){
            localStorage.setItem('DaoCreationData',JSON.stringify(newData));
        }
    }

    //search logic
    const [search, setSearch] = useState("");
    const [triggerSearch,setTriggerSearch] = useState(0);
    const contributorSearch = useMemo(() => {
        if (search==="") return contributors;
        setTriggerSearch(triggerSearch+1)
        return contributors.filter((_contributor:any) => {
            return (
                _contributor.author.login.toLowerCase().includes(search.toLowerCase()) ||
                _contributor.author.login === JSON.parse(localStorage.getItem('DaoCreationData')||'{}').repoFullName.split('/')[0] ||
                _contributor.author.login === daoCreator
            );
        });
    }, [search,contributors]);

    useEffect(()=>{
        if(session && Object.keys(contributors).length===0){
            FetchContributors();
        }
        if(algorithm==='Repository creator'){
            AlgoOwner();
        }else if(algorithm==='By amount of code contributed ( minified )'){
            AlgoCode();
        }else if(algorithm==='By duration of project involvement ( compute intensive )'){
            AlgoDuration();
        }
    },[session,contributors,MainDistribution])

    const AlgoOwner =()=>{
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const newData = OptionRepoOwner(oldData,contributors,MainDistribution,daoCreator);
        oldData.distribution = newData;
        localStorage.setItem('DaoCreationData',JSON.stringify(oldData));
        setTriggerToMain(triggerToMain+1);
    } 

    const AlgoCode = ()=>{
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const newData = CodeContributorStats(contributors,MainDistribution);
        oldData.distribution = newData;
        localStorage.setItem('DaoCreationData',JSON.stringify(oldData));
        setTriggerToMain(triggerToMain+1);
    }

    const AlgoDuration = ()=>{
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const newData = CodeDurationStats(contributors,MainDistribution);
        oldData.distribution = newData;
        localStorage.setItem('DaoCreationData',JSON.stringify(oldData));
        setTriggerToMain(triggerToMain+1);
    }

    const handlePageSubmit = () => {
        const newData = {
            "DaoFees": DaoFees,
            "algorithm": algorithm,
            "network": network,
        }
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const data = {...oldData,...newData}
        localStorage.setItem('DaoCreationData',JSON.stringify(data))
        router.push('/creation/4');
    }

    const AddNeonNetwork = async() =>{
        if (parseInt(window.ethereum.networkVersion) !== chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(chainId)}]
                });
            }   catch (err:any) {
                  // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainName: 'remote proxy — solana devnet',
                                chainId: ethers.utils.hexValue(chainId),
                                nativeCurrency: { name: 'NEON', decimals: 18, symbol: 'NEON' },
                                rpcUrls: ['https://proxy.devnet.neonlabs.org/solana']
                            }
                        ]
                    });
                }
            }
        }
    }

    return (
        <div 
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between items-center customGradient'
        >
            <div className='flex flex-col justify-start items-start h-[90%] w-full' >
                {/* input feild */}
                <div className='w-full relative'>
                    <input type="text" name='DaoFees' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] text-[1.63vh] font-semibold rounded-md border-[#373737] border`} placeholder='Enter DAO Fees' value={DaoFees} onChange={(e)=>setDaoFees(e.target.value)} required />
                    <CustomTooltip title="Fees DAO takes on rewards" enterDelay={500}  placement="right" arrow>
                        <InformationCircleIcon className='w-[5%] absolute top-[30%] right-[3%]' />
                    </CustomTooltip>
                </div>
                <div className='w-full relative'>
                    <input type="number" name='EnterDistribution' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] text-[1.63vh] font-semibold rounded-md border-[#373737] border disabled:border-green-900`} placeholder='Enter Distribution %' value={distributionPercentage} disabled={!editDistribution}
                    onChange={(e)=>setDistributionPercentage(e.target.value)} required />

                    <CustomTooltip title="Distribution percentage of total to Partners (Max-25%)" enterDelay={500}  placement="right" arrow>
                        <InformationCircleIcon className='w-[5%] absolute top-[30%] right-[3%]' />
                    </CustomTooltip>

                    {editDistribution && <CheckIcon className='w-[5%] absolute top-[30%] right-[10%]'
                    onClick={()=>{
                        setEditDistribution(false)
                        const storeData = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
                        if(distributionPercentage!==''){
                            if(parseFloat(distributionPercentage)>25){
                                setDistributionPercentage('25')
                                setMainDistribution('25')
                                storeData.distributionPercentage = '25'
                            }else{
                                storeData.distributionPercentage = distributionPercentage;
                                setMainDistribution(distributionPercentage)
                            }
                        }else{
                            storeData.distributionPercentage = '0';
                            setDistributionPercentage('0');
                            setMainDistribution('0')
                        }
                        localStorage.setItem('DaoCreationData',JSON.stringify(storeData))
                        if(algorithm==='Repository creator'){
                            AlgoOwner();
                        }else if(algorithm==='By amount of code contributed ( minified )'){
                            AlgoCode();
                        }else if(algorithm==='By duration of project involvement ( compute intensive )'){
                            AlgoDuration();
                        }else{
                            setTriggerToMain(triggerToMain+1);
                        }
                    }} />}
                    {!editDistribution && <PencilIcon className='w-[5%] absolute top-[30%] right-[10%]'
                    onClick={()=>{
                        setEditDistribution(true)
                    }} />}
                </div>

                {/* options */}
                <div className={`text-[1.81vh] mt-[3%] font-semibold`} >Token Distribution Algorithm <InformationCircleIcon className='w-[3.5%] inline' /></div>
                
                <div className={`text-[1.63vh] mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='Repository creator' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                AlgoOwner();
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <CustomTooltip title="Repository Owner gets All the Tokens" enterDelay={500}  placement="right" arrow>
                    <div>
                        Repository creator
                    </div>
                    </CustomTooltip>
                </div>

                <div className={`text-[1.63vh] mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='By amount of code contributed ( minified )' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                AlgoCode();
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <CustomTooltip title="Distribution based on contributors's code Total(adds+deletes) on the repo" enterDelay={500}  placement="right" arrow>
                    <div>
                        By amount of code contributed ( minified )
                    </div>
                    </CustomTooltip>
                </div>
                <div className={`text-[1.63vh] mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='By duration of project involvement ( compute intensive )' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                AlgoDuration();
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <CustomTooltip title="Distribution based on contributors's code Total(adds+deletes)/Covariance(adds+deletes on weekly basis) on the repo" enterDelay={500}  placement="right" arrow>
                    <div>
                        By duration of project involvement ( compute intensive ) 
                    </div>
                    </CustomTooltip>
                </div>

                {/* network */}
                <div className={`text-[1.81vh] mt-[3%] font-semibold`} >Supported Networks</div>

                <div className={`text-[1.63vh] mt-[2%] w-full flex flex-row w-full justify-between items-center`}>
                    <div className='flex flex-row w-full justify-start items-center'>
                        <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                            <input type="radio" name="NetworkOp" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='Neon Testnet' 
                            onChange={(e)=>{
                                if(e.target.checked){
                                    setNetwork(e.target.value);
                                }
                            }} />
                            <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                            flex justify-center items-center
                            peer-checked:after:block
                            after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                        </div>
                        <div>
                            Neon Testnet
                        </div>
                    </div>
                    <button onClick={AddNeonNetwork}  className='w-[30%] text-[#A7B9FC]' >
                        + Add Network
                    </button>
                </div>

                {/* Assign Distribution */}
                {/* Search User */}
                <div className='w-full relative mt-[3%]'>
                    <input type="text" name='SearchUser' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] text-[1.63vh] font-semibold rounded-md border-[#3A4E70] border`} placeholder='Search contributors by username' value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                    <SearchIcon className='w-[5%] absolute top-[30%] right-[3%] text-[#3A4E70]' />
                </div>
                <div className='flex flex-col justify-start items-center h-[100%] w-full relative overflow-y-scroll overflow-x-hidden customScrollbar'>
                    <div className='bg-[#121418] w-full h-[20%] px-[2%] py-[2%] mt-[2%] text-xs font-semibold rounded-md border-[#2E2E2F] border flex flex-row align-center justify-between' >
                        {/* user name */}
                        <div className='flex flex-row'>
                            <img src={JSON.parse(localStorage.getItem('DaoCreationData')||'{}').tokenImgIpfsURL||''} className='w-[2.5vh] h-[2.5vh] mr-[1vh] rounded-full'/>
                            <div className={`text-[#D7D7D7] text-[1.63vh]`}>{JSON.parse(localStorage.getItem('DaoCreationData')||'{}').daoName} DAO</div>
                        </div>
                        {/* user distribution */}
                        <div className={`px-[1%] text-[1.63vh] text-[#B5C3DB]
                        flex flex-row align-center justify-center`} >
                            <div>{
                            (JSON.parse(localStorage.getItem('DaoCreationData')||'{}').distributionPercentage)!==undefined 
                            ?`${100 - parseInt(JSON.parse(localStorage.getItem('DaoCreationData')||'{}').distributionPercentage)}%`:'100%'}</div> 
                        </div>
                    </div>

                    {!isLoading && contributorSearch.length > 0 && contributorSearch.map((contributor:any, idx:any)=>{
                        return (
                        <UserOptions contributor={contributor} key={idx}
                        triggerToMain={triggerToMain} 
                        setTriggerToMain={setTriggerToMain}
                        triggerSearch={triggerSearch} />
                        )
                    })}
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
            <button className={`${submitPage?"bg-gray-600":"bg-[#91A8ED]"} w-full py-[2%] text-[1.63vh] ${(errorMsg!=='')?'border-red-500 border-b-2 text-black':null} font-semibold rounded-md`}
            onClick={()=>{
                if(DaoFees==='' || distributionPercentage==='' || MainDistribution==='' || algorithm==='' || network==='' || editDistribution){
                    setErrorMsg("- fill all fields")
                    return
                }else if(localStorage.getItem('distributionOk')==='false'){
                    setErrorMsg("- % doesn't add upto 100%")
                    return
                }else if(parseInt(window.ethereum.networkVersion) !== chainId){
                    setErrorMsg("- Click Add Network")
                    return
                }
                if(!submitPage){
                    setSubmitPage(true)
                    handlePageSubmit()
                }
            }} >
                Confirm Token Distribution {errorMsg}
            </button>
        </div>
    );
}

export default CreationDistribution;