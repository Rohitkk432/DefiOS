import React from 'react'
import {useState,useEffect} from 'react'

import {useRouter} from 'next/router'

import { PhotographIcon,XIcon } from '@heroicons/react/outline';

declare let Buffer:any

interface CreationChooseTokenProps {

}

const CreationChooseToken: React.FC<CreationChooseTokenProps> = ({}) => {
    const router = useRouter()

    const [tokenImgFile , setTokenImgFile] = useState<any>();
    const [tokenImgPreview , setTokenImgPreview] = useState<any>();

    const [DaoName,setDaoName] = useState('');
    const [tokenName,setTokenName] = useState('');
    const [tokenSymbol,setTokenSymbol] = useState('');

    const [errorMsg,setErrorMsg] = useState('');

    const getHash = async()=>{
        const formData = new FormData();
        formData.append('file',tokenImgFile);
        const ipfsRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${process.env.PINATA_JWT}`
            },
            body: formData
        }).then(res=>res.json())
        .catch(err=>console.log(err))

        return ipfsRes.IpfsHash
    }

    useEffect(()=>{
        if (!tokenImgFile) {
            setTokenImgFile(undefined)
            setTokenImgPreview('')
            return
        }
        
        const objectUrl = URL.createObjectURL(tokenImgFile)
        setTokenImgPreview(objectUrl)

        // free memory when ever this component is unmounted
        // return () => URL.revokeObjectURL(objectUrl)
    },[tokenImgFile])

    const submitPage = async()=>{
        const imgHash = await getHash();
        const dataBefore = JSON.parse(localStorage.getItem('DaoCreationData')||'{}')
        const dataAdd = {
            "daoName": DaoName,
            "tokenName": tokenName,
            "tokenSymbol": tokenSymbol,
            "tokenImgFile": tokenImgFile,
            "tokenImgIpfsURL":`https://gateway.ipfs.io/ipfs/${imgHash}`,
            "tokenImgIpfsHash":imgHash,
        }
        const data = {...dataBefore,...dataAdd}
        localStorage.setItem('DaoCreationData',JSON.stringify(data))
        router.push('/creation/3')
    }

    return (
        <div 
        className='w-1/3 h-5/6 bg-[#121418] mx-[3.4%] rounded-2xl p-[1.5%] text-white flex flex-col justify-between items-center customGradient'
        >
            <div className='flex flex-col justify-center items-center h-[90%] w-full relative' >
                {/* image input */}
                <div className="w-[12vh] h-[12vh] flex justify-center items-center relative rounded-full border border-[#373737]">
                    {(tokenImgPreview!==''&& tokenImgFile!==undefined) ?
                    (
                        <div className='w-full h-full relative'>
                            <img src={tokenImgPreview} className='w-full h-full rounded-full' />
                            <XIcon className='absolute top-[-20%] right-[-20%] z-index-4 text-gray-500 w-[3vh] h-[3vh] cursor-pointer' onClick={()=>setTokenImgFile(undefined)} />
                        </div>
                    ) :
                    <PhotographIcon className='h-1/2 w-1/2 text-[#373737] stroke-1' />}
                    
                    <input type="file" name="TokenImg" className='opacity-0 absolute top-0 left-0 w-full h-full' 
                    onChange={(e) => {
                        if(e.target.files===null) return;
                        const file = e.target.files[0];
                        setTokenImgFile(file);
                    }} />
                </div>
                <div className={`text-[1.63vh] mt-[2%]`}>Token Logo</div>
                {/* input feild */}
                <input type="text" name='DaoName' className={`bg-[#121418] w-full py-[2%] px-[4%] mb-[2%] mt-[8%] text-[1.63vh] font-semibold rounded-md border-[#373737] border`} placeholder='Enter DAO Name' value={DaoName} onChange={(e)=>setDaoName(e.target.value)} />
                <input type="text" name='TokenName' className={`bg-[#121418] w-full py-[2%] px-[4%] my-[2%] text-[1.63vh] font-semibold rounded-md border-[#373737] border`} placeholder='Enter the Token Name' value={tokenName} onChange={(e)=>setTokenName(e.target.value)} />
                <input type="text" name='TokenSymbol'className={`bg-[#121418] w-full py-[2%] px-[4%] my-[2%] text-[1.63vh] font-semibold rounded-md border-[#373737] border`} placeholder='Enter the Token Symbol' value={tokenSymbol} onChange={(e)=>setTokenSymbol(e.target.value)} />

            </div>

            {/* Submit Btn */}
            <div className={`text-[1.63vh] mb-[2%] text-red-500`}>{errorMsg}</div>
            <button onClick={()=>{
                if(DaoName===''||tokenName===''||tokenSymbol===''||tokenImgFile===undefined){
                    setErrorMsg('Please fill all the fields')
                    return
                }
                submitPage()
            }} className={`bg-[#91A8ED] w-full py-[2%] text-[1.63vh] font-semibold rounded-md`} >
                Confirm Token Specification
            </button>
        </div>
    );
}

export default CreationChooseToken;