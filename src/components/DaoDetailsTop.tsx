import React from 'react'
import {useState, useEffect} from 'react'

import {ethers} from 'ethers'
import { Contract as MultiContract, Provider, setMulticallAddress } from "ethers-multicall";
import DaoAbi from './ContractFunctions/DaoABI.json'
import DefiOSNamesRouterABI from './ContractFunctions/DefiOSNamesRouterABI.json'
declare let window:any

import {timeAgo,GraphDataGenerator} from '../utils/timeUtils'
import {SupportIcon} from '@heroicons/react/outline'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MultiAxisLineChartProps{
    Token : string,
    chartData:any
}

const MultiAxisLineChart: React.FC<MultiAxisLineChartProps> = ({Token,chartData}) => {
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        plugins: {
            legend: {
                display: true,
                align:"start" as const,
                labels: {
                    usePointStyle: true,
                    pointStyle:'circle' as const,
                    padding: 30,
                    boxWidth: 5,
                    boxHeight: 5,
                    color: '#FFF' as const,
                },
            },
            tooltip: {
                enabled: true,
                usePointStyle: true,
                pointStyle:'circle' as const,
                borderWidth: 0,
                boxWidth:7,
                boxHeight:7,
                boxPadding:10,
                padding:15,
                backgroundColor:"rgba(78, 75, 116,0.8)",
                callbacks: {
                    // title: function (tooltipItem:any) {
                    //     return '';
                    // },
                    label: function (tooltipItem:any) {
                        var tooltipText = '';
                        if (tooltipItem.dataset.data[tooltipItem.dataIndex] != null)
                            tooltipText = tooltipItem.dataset.data[tooltipItem.dataIndex]!.toString();
                        return tooltipText;
                    }
                }
            }
        },
        scales: {
            x:{
                grid: {
                    display: false,
                },
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: {
                    display: false,
                },
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    display: false,
                },
            },
        },
        elements: {
            point:{
                radius: 0
            },
        },
    };
    const labels = chartData.intervals;
    const data = {
        labels,
        datasets: [
            {
                label: 'Issues Created',
                data: chartData.issuesCount,
                borderColor: '#fb9230',
                backgroundColor: '#fb9230',
                yAxisID: 'y',
                tension: 0.3,
            },
            {
                label: `${Token} Staked`,
                data: chartData.stakedCount,
                borderColor: 'rgb(68, 190, 215)',
                backgroundColor: 'rgb(68, 190, 215)',
                yAxisID: 'y1',
                tension: 0.3,
            },
        ],
    };
    return (
        <Line data={data} options={options} />
    );
}

interface DaoDetailsTopProps {
    DaoInfo: any;
    setRunTour: React.Dispatch<React.SetStateAction<boolean>>;
    runTour: boolean;
}

const DaoDetailsTop: React.FC<DaoDetailsTopProps> = ({DaoInfo,setRunTour,runTour}) => {

    const [TopStaker, setTopStaker] = useState<string>()
    const [TopSolver, setTopSolver] = useState<string>()

    const [chartData, setChartData] = useState<any>()

    const getTopStaker = async()=>{
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let daoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi, signer);

        //multi-call
        setMulticallAddress(245022926,process.env.NEXT_PUBLIC_MULTI_CALL_ADDRESS||"");
        const ethcallProvider = new Provider(provider, 245022926);
        let daoMultiContract:MultiContract  = new MultiContract(DaoInfo.DAO, DaoAbi);

        const countOfIssues = await daoContract.issueID().then((res:any)=>res).catch(()=>0);

        let stakersArray:any = {};
        let uniqueStakers:any = [];
        let callsArray:any = [];
        let stakersCountPerIssue:any = []
        for (let i=1;i<=countOfIssues;i++) {
            callsArray.push(await daoMultiContract.getStakersCount(i));
        }
        if(callsArray.length > 0 && countOfIssues!==0){
            const _multiRes = await ethcallProvider.all(callsArray)
            const multiRes = _multiRes.map((res:any)=>Number(res));
            stakersCountPerIssue = multiRes;
        }
        callsArray = []
        for (let i=0;i<stakersCountPerIssue.length;i++) {
            for(let j=0;j<stakersCountPerIssue[i];j++){
                callsArray.push(await daoMultiContract.stakers(i+1,j));
            }
        }
        if(callsArray.length > 0 && countOfIssues!==0){
            const _multiRes = await ethcallProvider.all(callsArray)
            const multiRes = _multiRes.map((res)=>{
                return {
                    staker:res.staker,
                    amount:Number(res.amount),
                }
            });
            stakersArray = multiRes;
        }

        for(let i=0;i<stakersArray.length;i++){
            const keys = Object.keys(uniqueStakers)
            if(keys.includes(stakersArray[i].staker)){
                uniqueStakers[stakersArray[i].staker] += stakersArray[i].amount;
            }else{
                uniqueStakers[`${stakersArray[i].staker}`] = stakersArray[i].amount;
            }
        }
        if(Object.keys(uniqueStakers).length===0) return;
        let topStaker = Object.keys(uniqueStakers).reduce((a, b) => uniqueStakers[a] > uniqueStakers[b] ? a : b);

        setTopStaker(topStaker);
    }

    const getTopSolver = async()=>{
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let daoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi, signer);

        //multi-call
        setMulticallAddress(245022926,process.env.NEXT_PUBLIC_MULTI_CALL_ADDRESS||"");
        const ethcallProvider = new Provider(provider, 245022926);
        let daoMultiContract:MultiContract  = new MultiContract(DaoInfo.DAO, DaoAbi);

        const countOfIssues = await daoContract.issueID().then((res:any)=>res).catch(()=>0);

        let solversArray:any = {};
        let uniqueSolvers:any = [];
        let callsArray:any = [];
        for (let i=1;i<=countOfIssues;i++) {
            callsArray.push(await daoMultiContract.repoIssues(i));
        }
        if(callsArray.length > 0 && countOfIssues!==0){
            const _multiRes = await ethcallProvider.all(callsArray)
            const multiRes = _multiRes.map((res:any)=>res.solver);
            solversArray = multiRes;
        }
        for(let i=0;i<solversArray.length;i++){
            if(solversArray[i] === "0x0000000000000000000000000000000000000000") continue;
            const keys = Object.keys(uniqueSolvers)
            if(keys.includes(solversArray[i])){
                uniqueSolvers[solversArray[i]] += 1;
            }else{
                uniqueSolvers[`${solversArray[i]}`] = 1;
            }
        }

        if(Object.keys(uniqueSolvers).length===0) return;
        let topSolver = Object.keys(uniqueSolvers).reduce((a, b) => uniqueSolvers[a] > uniqueSolvers[b] ? a : b);

        const namesDefiOSAddress:any= process.env.NEXT_PUBLIC_NAMES_DEFIOS_ADDRESS
        let gitMapperContract : ethers.Contract = new ethers.Contract(namesDefiOSAddress, DefiOSNamesRouterABI, signer);

        const topSolverName = await gitMapperContract.address_to_name_map(topSolver).then((res:any)=>res).catch(()=>topSolver);
        const UserInfo = await fetch('https://api.github.com/user/'+topSolverName).then((res)=>res.json()).catch((err:any)=>console.log(err))

        setTopSolver(UserInfo.login);
    }

    const getGraphData = async()=>{
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let daoContract : ethers.Contract = new ethers.Contract(DaoInfo.DAO, DaoAbi, signer);

        //multi-call
        setMulticallAddress(245022926,process.env.NEXT_PUBLIC_MULTI_CALL_ADDRESS||"");
        const ethcallProvider = new Provider(provider, 245022926);
        let daoMultiContract:MultiContract  = new MultiContract(DaoInfo.DAO, DaoAbi);

        const countOfIssues = await daoContract.issueID().then((res:any)=>res).catch(()=>0);

        if(countOfIssues<=1){
            setChartData(null)
            return;
        }

        let issuesArray:any = [];
        let callsArray:any = [];
        for (let i=1;i<=countOfIssues;i++) {
            callsArray.push(await daoMultiContract.repoIssues(i));
        }
        
        if(callsArray.length > 0 && countOfIssues!==0){
            const _multiRes = await ethcallProvider.all(callsArray)
            const multiRes = _multiRes.map((res:any)=>res);
            const _issueArr:any = []
            for(let i = 0;i<multiRes.length;i++){
                const apiURL = multiRes[i].issueURL.replace('github.com','api.github.com/repos');
                const _issueInfo = await fetch(apiURL).then((res)=>res.json()).catch((err:any)=>console.log(err))
                _issueArr.push({
                    issueUrl:multiRes[i].issueURL,
                    issueStaked:parseInt(ethers.utils.formatEther(multiRes[i].totalStaked)),
                    createdAt : _issueInfo.created_at
                });
            }
            issuesArray = _issueArr;
        }

        issuesArray.sort((a:any,b:any) => Date.parse(a.createdAt) - Date.parse(b.createdAt))

        const graphData = GraphDataGenerator(issuesArray);
        setChartData(graphData);
    }


    useEffect(()=>{
        if(DaoInfo!==undefined){
            getTopStaker();
            getTopSolver();
            getGraphData();
        }
    },[DaoInfo])

    return (
        <div className='w-full h-[48%] flex flex-row justify-between items-center'>
            <div className='dao-details__step1 w-[30%] h-full rounded-md bg-[#191C21] flex flex-col justify-center items-start px-[2%]'>
                {DaoInfo===undefined &&
                    <div className='w-full h-full flex flex-col justify-center items-center'>
                        <svg aria-hidden="true" className="w-[5vh] h-[5vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <div className='text-[2.5vh] mt-[1vh]' >Loading</div>
                    </div>
                }
                {DaoInfo && 
                <>
                <div className='text-[3vh] font-semibold mb-[10%] flex flex-col items-center w-full' >
                    <img src={DaoInfo.metadata.tokenImg} alt="" className='rounded-full w-[10vh] h-[10vh] mb-[1%]' />
                    <div>{DaoInfo.metadata.daoName}</div>
                </div>
                <div className='w-full flex flex-col justify-between items-start text-[2vh]' >
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Token : </div>
                        <div className='text-gray-400'>{`${DaoInfo.metadata.tokenName} (${DaoInfo.metadata.tokenSymbol})`}</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Contract :</div>
                        <a href={`https://neonscan.org/address/${DaoInfo.DAO}`} target="_blank" className='text-gray-400'>
                            {(DaoInfo.DAO.slice(0,5)+"..."+DaoInfo.DAO.slice(37,42))}
                        </a>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div >Repository : </div>
                        <a href={DaoInfo.metadata.repoUrl} target="_blank" className='text-gray-400 flex flex-row justify-end w-[70%]'>
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                            <div>/{DaoInfo.metadata.repoName.length>27?(DaoInfo.metadata.repoName+"..."):DaoInfo.metadata.repoName}</div>
                        </a>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Created by :</div>
                        <a href={`https://neonscan.org/address/${DaoInfo.owner}`} target="_blank" className='text-gray-400'>{(DaoInfo.owner.slice(0,5)+"..."+DaoInfo.owner.slice(37,42))}</a>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Created at :</div>
                        <div className='text-gray-400'>{timeAgo(DaoInfo.metadata.createdAt)} ago</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Chain :</div>
                        <div className='text-gray-400'>
                            {DaoInfo.metadata.chain}</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Top Holder :</div>
                        <div className='text-gray-400'>-</div>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Top Staker :</div>
                        <a href={TopSolver!==undefined?`https://neonscan.org/address/${TopStaker}`:""} target="_blank" className='text-gray-400'>{TopStaker!==undefined ?
                        (TopStaker.slice(0,5)+"..."+TopStaker.slice(37,42)) : "-"
                        }</a>
                    </div>
                    <div className='mb-[2.5%] flex flex-row w-full justify-between items-center '>
                        <div>Top Solver :</div>
                        {TopSolver!==undefined ?
                        <a href={`http://github.com/${TopSolver}`} target="_blank" className='text-gray-400 flex flex-row justify-end w-[70%]'>
                            <img src='https://res.cloudinary.com/rohitkk432/image/upload/v1660743146/Ellipse_12_vvyjfb.png' className='h-[2.5vh] mr-[3%]' />
                            <div>/{TopSolver}</div>
                        </a>:
                        <div className='text-gray-400'>-</div>
                        }
                    </div>
                </div>
                <div className='dao-details__step2 font-bold text-center
                border border-white text-[2.5vh]
                rounded-md py-[2.5%] my-[3%] w-full' >
                    {/* <span>1 APE = $0.5</span>
                    <span className='text-green-500'> (+0.5%)</span> */}
                    <div>1 {DaoInfo.metadata.tokenSymbol} = ?? USDC</div>
                </div>
                </>
                }
            </div>

            <div className='dao-details__step3 w-[69%] text-center h-full rounded-md  p-[1.5%] bg-[#191C21] relative'>
                <button className={`flex flex-row justify-center items-center 
                ${runTour?"text-gray-600":"text-white"}
                py-[1vh] rounded-[1vh] absolute top-[1vh] right-[2vh] text-white flex flex-row items-center justify-center`}
                onClick={()=>{
                    setRunTour(true);
                }}>
                    <SupportIcon className="h-[3.5vh] w-[3.5vh] mr-[1vh]"/>
                    <div className='text-[2.8vh] font-semibold'>Tutorial</div>
                </button>
                {(DaoInfo===undefined || chartData===undefined) &&
                    <div className='w-full h-full flex flex-col justify-center items-center'>
                        <svg aria-hidden="true" className="w-[5vh] h-[5vh] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <div className='text-[2.5vh] mt-[1vh]' >Loading</div>
                    </div>
                }
                {DaoInfo && chartData!==undefined && chartData!==null &&
                <>
                <div className='text-[#91A8ED] text-[4vh]'>Community Health</div>
                <MultiAxisLineChart chartData={chartData} Token={DaoInfo.metadata.tokenSymbol} />
                </>
                }
                {DaoInfo && chartData===null &&
                <div className='text-gray-500 text-[3vh] flex items-center justify-center w-full h-full'>Not enough data yet to plot the chart</div>
                }
            </div>
        </div>
    );
}

export default DaoDetailsTop;