import React from 'react'
import {useState,useEffect} from 'react'
import {ethers} from 'ethers'
import contractAbi from "../ContractFunctions/DaoFactoryABI.json"
import LoadingScreen from '../utils/LoadingScreen'

import {CheckIcon} from '@heroicons/react/outline'

import { useSession } from "next-auth/react";
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

interface CreationProcessProps {
    creationStarter: boolean;
}

declare let window:any

const CreationProcess: React.FC<CreationProcessProps> = ({creationStarter}) => {    
    const {data:session} = useSession()
    const contractAddress:any = process.env.DEFIOS_CONTRACT_ADDRESS;
    
    const [load, setLoad] = useState(false)
    const [processStep, setProcessStep] = useState(-1)

    const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            borderRadius: '1vh',
            fontSize: '2vh',
            padding:'1vh',
            maxWidth: '15vw',
        },
    }));

    const process1 = async () => {
        setProcessStep(0);

        const github_uid = session?.user?.image?.split('/')[4]?.split("?")[0] 
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "pub_key": localStorage.getItem('currentAccount'),
                    "github_uid": github_uid,
                    "github_access_token": session?.accessToken
                }
            )
        };
        const returnSig = await fetch('https://names.defi-os.com/encrypt',requestOptions)
        .then(res=>res.status===200?res.json():null)
        .then(res=>{
            setProcessStep(1)
            return res.signature
        })
        .catch(err=>console.log(err))

        return returnSig
    }

    const process2 = async (signature:string) => {
        const data = JSON.parse(localStorage.getItem('DaoCreationData')||'')
        const repoInfo = await fetch(`https://api.github.com/repos/${data.repoFullName}`,{
                method:"GET",
                headers:{
                    "Authorization":`token ${session?.accessToken}`,
                    "Accept":"application/vnd.github.v3+json"
                }
            })
        .then(res=>res.json())
        .catch(err=>console.log(err))

        const partenerData = Object.values(data.distribution).map((value:any)=>
            ethers.utils.parseEther(Math.floor(parseFloat(value)*(10**5)).toString())
        )
        const partenerKeys = Object.keys(data.distribution);

        const partnersDataSorted:any = []
        const partnersKeysSorted:any = []

        for(let i=0;i<partenerKeys.length;i++){
            const userGithub:any = await fetch(`https://api.github.com/users/${partenerKeys[i]}`,{
                method:"GET",
                headers:{
                    "Authorization":`token ${session?.accessToken}`,
                    "Accept":"application/vnd.github.v3+json"
                }
            })
            .then(res=>res.json())
            if(partenerKeys[i]?.toLowerCase()===data.repoFullName.split('/')[0].toLowerCase()){
                partnersKeysSorted.unshift((userGithub.id).toString())
                partnersDataSorted.unshift(partenerData[i])
            }else{
                partnersKeysSorted.push(userGithub.id.toString())
                partnersDataSorted.push(partenerData[i])
            }
        }

        const proposal = [repoInfo.html_url,repoInfo.name,localStorage.getItem('currentAccount'),signature]
        const metadataToHash = {
            'daoName':data.daoName,
            'daoFees':data.DaoFees,
            'tokenName':data.tokenName,
            'tokenSymbol':data.tokenSymbol,
            'repoUrl':repoInfo.html_url,
            'repoName':repoInfo.name,
            'partners':partnersKeysSorted,
            'tokenImg':data.tokenImgIpfsHash,
            'chain':data.network,
            'createdAt':Date.now()
        }
        const ipfsRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${process.env.PINATA_JWT}`
            },
            body: JSON.stringify(metadataToHash)
        }).then(res=>res.json())
        .catch(err=>console.log(err))

        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let defiosContract : ethers.Contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const userDaoCount = await defiosContract.getUserDAOCount(localStorage.getItem('currentAccount'))

        const creation = await defiosContract.createGitDAO(proposal,partnersKeysSorted,partnersDataSorted,parseFloat(data.DaoFees)*(10**18),ipfsRes.IpfsHash,data.tokenName,data.tokenSymbol);
        await creation.wait()
        setProcessStep(5)

        return Number(userDaoCount)
    }

    const process3 = async(initialCount:number)=>{
        //web3
        let provider :ethers.providers.Web3Provider = new ethers.providers.Web3Provider(window.ethereum) ;
        let signer: ethers.providers.JsonRpcSigner = provider.getSigner();
        let defiosContract : ethers.Contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const userDaoCount = await defiosContract.getUserDAOCount(localStorage.getItem('currentAccount'))

        if(Number(userDaoCount)===initialCount+1){
            setProcessStep(6)
            localStorage.removeItem('DaoCreationData')
            localStorage.removeItem('distributionOk')
            setLoad(true);
        }
    }

    useEffect(() => {
        if(session && creationStarter && processStep === -1){
            process1().then(res=>{
                process2(res).then((initialCount)=>{
                    process3(initialCount)
                })
            });
        }
    } ,[creationStarter,processStep])

    return (
        <div 
        className='w-[19.5%] min-h-[42.2%] h-auto bg-[#121418] rounded-2xl text-white flex flex-col items-start justify-start pt-[1.5%] customGradient'
        >   
            {/* completed */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center ${(processStep>=1)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===0)?null:'border border-[#727272] border-dashed'} `}>
                    {
                        (processStep>=1) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===0) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <CustomTooltip title="Mapping & verifying Github UID with Wallet Public Key" enterDelay={500}  placement="right" arrow>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=1)?'text-[#A7B9FC]':(processStep===0)?'text-white':'text-[#727272]'} w-[70%]`}>
                    Verifying connection of github UID with public key 
                </div>
                </CustomTooltip>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=1)?'border-r border-solid border-[#A7B9FC]':'border-r border-dashed border-[#727272]'}`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center ${(processStep>=2)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===1)?null:'border border-[#727272] border-dashed'} `}>
                    {
                        (processStep>=2) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===1) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <CustomTooltip title="Pinning metadata to IPFS & calling create_dao function" enterDelay={500}  placement="right" arrow>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=2)?'text-[#A7B9FC]':(processStep===1)?'text-white':'text-[#727272]'} w-[70%]`}>
                    <div>Calling create_dao on</div>
                    <a href={`https://neonscan.org/address/${process.env.DEFIOS_CONTRACT_ADDRESS}`} target="_blank" className='underline text-[#99DCF7]' >
                        {process.env.DEFIOS_CONTRACT_ADDRESS?.slice(0,5)+"..."+process.env.DEFIOS_CONTRACT_ADDRESS?.slice(37,42)}
                    </a>
                </div>
                </CustomTooltip>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=2)?'border-r border-solid border-[#A7B9FC]':'border-r border-dashed border-[#727272]'}`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center ${(processStep>=3)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===2)?null:'border border-[#727272] border-dashed'}`}>
                    {
                        (processStep>=3) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===2) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <CustomTooltip title="Creating & Deploying DAO contract" enterDelay={500}  placement="right" arrow>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=3)?'text-[#A7B9FC]':(processStep===2)?'text-white':'text-[#727272]'} w-[70%]`}>
                    Deploying DAO 
                </div>
                </CustomTooltip>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=3)?'border-r border-solid border-[#A7B9FC]':'border-r border-dashed border-[#727272]'}`}></div>

            {/* processing */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center  
                ${(processStep>=4)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===3)?null:'border border-[#727272] border-dashed'} `}>

                    {/* loading spinner */}
                    {
                        (processStep>=4) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===3) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                    
                </div>
                <CustomTooltip title="Creating & Deploying ERC-20 Token contract" enterDelay={500}  placement="right" arrow>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=4)?'text-[#A7B9FC]':(processStep===3)?'text-white':'text-[#727272]'} w-[70%]`}>
                    Deploying ERC-20 Token
                </div>
                </CustomTooltip>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=4)?'border-r border-solid border-[#A7B9FC]':'border-r border-dashed border-[#727272]'}`}></div>

            {/* remaining */}
            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center  
                ${(processStep>=5)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===4)?null:'border border-[#727272] border-dashed'} `}>
                    {
                        (processStep>=5) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===4) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <CustomTooltip title="Setting initial partners token distribution to claim later" enterDelay={500}  placement="right" arrow>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=5)?'text-[#A7B9FC]':(processStep===4)?'text-white':'text-[#727272]'} w-[70%]`}>
                    Setting initial token distribution
                </div>
                </CustomTooltip>
            </div>
            <div className={`w-[calc(83vh/48)] h-[calc(113vh/54)] mx-[6%] ${(processStep>=5)?'border-r border-solid border-[#A7B9FC]':(processStep===4)?null:'border-r border-dashed border-[#727272]'}`}></div>

            <div className='flex flex-row items-center justify-start w-full'>
                <div className={`w-[calc(83vh/24)] h-[calc(83vh/24)] mx-[6%] text-[1.63vh] rounded-full flex items-center justify-center 
                ${(processStep>=6)?'border bg-[#A7B9FC] border-[#A7B9FC] border-solid':(processStep===5)?null:'border border-[#727272] border-dashed'} `}>
                    {
                        (processStep>=6) ? <CheckIcon className="w-[60%]"/> : null
                    }
                    {
                        (processStep===5) ? 
                        <div className="lds-spinner">
                            <div></div><div></div><div></div><div></div>
                            <div></div><div></div><div></div><div></div>
                        </div>: null
                    }
                </div>
                <CustomTooltip title="Verifying contract creation success" enterDelay={500}  placement="right" arrow>
                <div className={`text-[1.63vh] font-semibold ${(processStep>=6)?'text-[#A7B9FC]':(processStep===5)?'text-white':'text-[#727272]'} w-[70%]`}>
                    <div>Completing call back to</div>
                    <a href={`https://neonscan.org/address/${process.env.DEFIOS_CONTRACT_ADDRESS}`} target="_blank" className='underline text-[#99DCF7]' >
                        {process.env.DEFIOS_CONTRACT_ADDRESS?.slice(0,5)+"..."+process.env.DEFIOS_CONTRACT_ADDRESS?.slice(37,42)}
                    </a>
                </div>
                </CustomTooltip>
            </div>

            <div className={`w-[90%] mx-auto  text-center text-[1.81vh] border-t border-[#9D9D9D] py-[3%] mb-[4%] mt-[6%] font-semibold`} >DAO creation {processStep===-1?0:Math.round(processStep/6 *100*100)/100}% completed</div>

            <LoadingScreen load={load} setLoad={setLoad} success="DAO Creation Complete" />
        </div>
    );
}

export default CreationProcess;