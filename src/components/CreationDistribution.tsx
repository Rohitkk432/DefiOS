import React from 'react'
import {useState,useEffect} from 'react'
import { useRouter } from 'next/router';
import UserOptions from './UserOptions';
import { InformationCircleIcon , SearchIcon } from '@heroicons/react/outline';

interface CreationDistributionProps {
    triggerToMain:number;
    setTriggerToMain:React.Dispatch<React.SetStateAction<number>>;
}

const CreationDistribution: React.FC<CreationDistributionProps> = ({triggerToMain,setTriggerToMain}) => {
    const router = useRouter();

    const [DaoFees,setDaoFees] = useState('');
    const [distributionPercentage,setDistributionPercentage] = useState('');
    const [algorithm,setAlgorithm] = useState('');
    const [network,setNetwork] = useState('');
    const [errorMsg,setErrorMsg] = useState(false);

    const [contributors,setContributors] = useState([]);
    const [isLoading,setIsLoading]=useState(true);

    useEffect(()=>{
        const dataInStorage = JSON.parse(localStorage.getItem('DaoCreationData')||'');
        if (dataInStorage===''||dataInStorage===[] || dataInStorage==={}) return;
        const repoName = dataInStorage.repoFullName;
        if (repoName==='') return; 
        fetch(`http://localhost:3000/api/repo/contributors/${repoName}`)
        .then(res => res.json())
        .then(data => {
            setContributors(data);
            setIsLoading(false);
            
            const distributionInit:any = {}

            data.forEach((el:any) => {
                const contri = el.login
                distributionInit[`${contri}`] = '0%';
            })
            

            const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'')
            const newData = {...oldData,distribution:distributionInit}

            if(oldData.distribution===undefined){
                localStorage.setItem('DaoCreationData',JSON.stringify(newData));
            }
            
        }).catch(err => {
            console.log(err);
        })
    },[])

    const handlePageSubmit = () => {
        const newData = {
            "DaoFees": DaoFees,
            "distributionPercentage": distributionPercentage,
            "algorithm": algorithm,
            "network": network,
        }
        const oldData = JSON.parse(localStorage.getItem('DaoCreationData')||'')
        const data = {...oldData,...newData}
        localStorage.setItem('DaoCreationData',JSON.stringify(data))
        router.push('/creation/4');
    }

    const fontsizer = 'text-[calc(98vh/54)]';
    const fontsizer2 = 'text-[calc(98vh/60)]';

    return (
        <div 
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between items-center'
        >
            <div className='flex flex-col justify-start items-start h-[90%] w-full' >
                {/* input feild */}
                <div className='w-full relative'>
                    <input type="text" name='DaoFees' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] ${fontsizer2} font-semibold rounded-md border-[#373737] border`} placeholder='Enter DAO Fees' value={DaoFees} onChange={(e)=>setDaoFees(e.target.value)} required />
                    <InformationCircleIcon className='w-[5%] absolute top-[30%] right-[3%]' />
                </div>
                <div className='w-full relative'>
                    <input type="text" name='EnterDistribution' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] ${fontsizer2} font-semibold rounded-md border-[#373737] border`} placeholder='Enter Distribution %' value={distributionPercentage} 
                    onChange={(e)=>setDistributionPercentage(e.target.value)} required />
                    <InformationCircleIcon className='w-[5%] absolute top-[30%] right-[3%]' />
                </div>

                {/* options */}
                <div className={`${fontsizer} mt-[3%] font-semibold`} >Token Distribution Algorithm <InformationCircleIcon className='w-[3.5%] inline' /></div>

                <div className={`${fontsizer2} mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='Repository creator' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        Repository creator
                    </div>
                </div>
                <div className={`${fontsizer2} mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='By amount of code contributed ( minified )' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        By amount of code contributed ( minified )
                    </div>
                </div>
                <div className={`${fontsizer2} mt-[2%] flex flex-row w-full justify-start items-center`}>
                    <div className="w-[2vh] h-[2vh] mr-[2%] relative">
                        <input type="radio" name="TokenAlgo" className='peer absolute opacity-0 w-full h-full cursor-pointer' value='By duration of project involvement ( compute intensive )' 
                        onChange={(e)=>{
                            if(e.target.checked){
                                setAlgorithm(e.target.value);
                            }
                        }} />
                        <span className="rounded-full border-[#91A8ED] border w-full h-full bg-[#121418] 
                        flex justify-center items-center
                        peer-checked:after:block
                        after:w-3/5 after:h-3/5 after:bg-[#91A8ED] after:rounded-full after:hidden"></span>
                    </div>
                    <div>
                        By duration of project involvement ( compute intensive ) 
                    </div>
                </div>

                {/* network */}
                <div className={`${fontsizer} mt-[3%] font-semibold`} >Supported Networks</div>

                <div className={`${fontsizer2} mt-[2%] w-full flex flex-row w-full justify-between items-center`}>
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
                    <div className='w-[30%] text-[#A7B9FC]' >
                        + Add Network
                    </div>
                </div>

                {/* Assign Distribution */}
                {/* Search User */}
                <div className='w-full relative mt-[3%]'>
                    <input type="text" name='SearchUser' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[1%] ${fontsizer2} font-semibold rounded-md border-[#3A4E70] border`} placeholder='Search contributors by username' />
                    <SearchIcon className='w-[5%] absolute top-[30%] right-[3%] text-[#3A4E70]' />
                </div>
                <div className='flex flex-col justify-start items-center h-[100%] w-full relative overflow-y-scroll overflow-x-hidden customScrollbar'>

                    {isLoading && <div className='m-auto'>Loading...</div>}
                    {!isLoading && contributors.length > 0 && contributors.map((contributor, idx)=>{
                        return (
                        <UserOptions contributor={contributor} key={idx}
                        triggerToMain={triggerToMain} 
                        setTriggerToMain={setTriggerToMain} />
                        )
                    })}

                </div>

            </div>
            {/* Submit Btn */}
            <button className={`bg-[#91A8ED] w-full py-[2%] ${fontsizer2} ${errorMsg?'border-red-500 border-b-2 text-black':null} font-semibold rounded-md`}
            onClick={()=>{
                if(DaoFees==='' || distributionPercentage==='' || algorithm==='' || network===''){
                    setErrorMsg(true)
                    return
                }
                handlePageSubmit()
            }} >
                Confirm Token Distribution {errorMsg?'- fill all fields':null}
            </button>
        </div>
    );
}

export default CreationDistribution;