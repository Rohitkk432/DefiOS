import React from 'react';

import { keyStores,connect, WalletConnection } from 'near-api-js';
import { useSession, signIn } from 'next-auth/react';
import { GoMarkGithub } from 'react-icons/go';


import config from '../config/index.json';

const { company } = config;
const { biglogo } = company;

  const connectWallet = async () => {
    const networkConfig = {
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
 // @ts-ignore
    const near = await connect(networkConfig);
 // @ts-ignore
    const wallet = new WalletConnection(near);

    if (!wallet.isSignedIn()){
      await wallet.requestSignIn(
        "codefi1.testnet",
        "DefiOS",
        // https://defi-os.com/chooserepo,
        "http://localhost:3000/chooserepo",
        // failure callback url
    );
    }else{
      // @ts-ignore
      // https://defi-os.com/chooserepo,
      window.location = "http://localhost:3000/chooserepo";
    }
    return wallet;
}

export default function Homepage() {

  const { data: session } = useSession();

  return (
    
    <div className='h-screen justify-between flex flex-col'>
      
      <div className='m-auto object-cover h-50 w-50'>
        <img alt="logo" className="" src={biglogo} />
      </div>      
      <div>
      
      </div>
      <div className='grid place-content-center mb-3'>
      {!session &&
      <button onClick={() => signIn()} className='rounded-full flex justify-between text-white pt-6 text-xl h-20 w-70 pl-5 pr-5 bg-red-500 align-middle hover:bg-red-600'>
     <div className='pb-2 pr-2 '>
     <GoMarkGithub size={36} /> 
     </div>
     <div className=''>
     connect with Github! 
     </div>
      </button>
}
{session &&
      <button onClick={() => connectWallet()} className='rounded-full flex justify-between text-white pt-6 text-xl h-20 w-70 pl-5 pr-5 bg-red-500 align-middle hover:bg-red-600'>
     <div className='pb-2 pr-2 '>
     <GoMarkGithub size={36} /> 
     </div>
     <div className=''>
     hello {session.user?.name}! click here to connect your near Wallet! 
     
     </div>
      </button>
}


      </div>
      </div>
  
  )
}