


import React from 'react';

import {Contract, keyStores, WalletConnection,connect} from "near-api-js";

const BOOTSTRAP_TOKENS_GAS = "60000000000000"; // 60 Terra Gas

const TOKEN_DEPLOY_COST = "3000000000000000000000000"; // 3 Near

// @ts-ignore
// eslint-disable-next-line unused-imports/no-unused-vars
const setupContract = async (contractId) => {

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

  const signerAccount = wallet.account();
    const contract = new Contract(
        signerAccount, // the account object that will sign and send tx
        contractId,
        {
            viewMethods: [""],
            changeMethods: ["new", "bootstrap_tokens", "on_create"],
        }
    );

    return contract;

}

 // @ts-ignore
 const handleSubmit = async(event) => {
  event.preventDefault(); 
  const tokensymbol = event.target.tokensymbol.value;

  const params = new URLSearchParams(window.location.search)
  const contractId = `${params.get("signMeta")  }.codefi1.testnet`
  const contract = await setupContract(contractId);

  const totalSupply = "1000000";
const metadata = { 
    "spec": "ft-1.0.0",
    "name": params.get("signMeta"),
    "symbol": tokensymbol,
    "icon": "Default",
    "reference": "ipfs://metadata/example.link",
    "reference_hash": "AK3YRHqKhCJNmKfV6SrutnlWW/icN5J8NUPtKsNXR1M=",
    "decimals": 0
};


// @ts-ignore
const daoname = params.get("signMeta");

const tokensymbolquery = 'tokensymbol='.concat(tokensymbol);
// @ts-ignore
const daoaccountidquery = 'daoaccountid='.concat(daoname).concat('.codefi1.testnet');

// @ts-ignore
  await contract.bootstrap_tokens({
    // callbackUrl: 'https://defi-os.com/daocreated'.concat('?').concat(tokensymbolquery).concat('&').concat(daoaccountidquery) ,
    callbackUrl: 'http://localhost:3000/daocreated'.concat('?').concat(tokensymbolquery).concat('&').concat(daoaccountidquery) ,
    args: {
      total_supply: totalSupply,
      metadata
  },
  gas: BOOTSTRAP_TOKENS_GAS,
  amount: TOKEN_DEPLOY_COST,
  });
  
}

export default function Choosetoken() {

  return (
    <div className='grid place-items-center h-screen'>
      <form onSubmit={handleSubmit}>
  <div className="relative z-0 w-full mb-6 group">
      <input type="text" name="daoname" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer" placeholder=" " required />
      <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">DAO Name- </label>
  </div>
  <div className="relative z-0 w-full mb-6 group">
      <input type="text" name="tokensymbol" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer" placeholder=" " required />
      <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">DAO Token Symbol- </label>
  </div>

  {/* </div>
  <div className="relative z-0 w-full mb-6 group">
      <input type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer" placeholder=" " required />
      <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
  </div>
  <div className="relative z-0 w-full mb-6 group">
      <input type="password" name="repeat_password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer" placeholder=" " required />
      <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
  </div>
  <div className="grid xl:grid-cols-2 xl:gap-6">
    <div className="relative z-0 w-full mb-6 group">
        <input type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer" placeholder=" " required />
        <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
    </div>
    <div className="relative z-0 w-full mb-6 group">
        <input type="text" name="floating_last_name" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer" placeholder=" " required />
        <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
    </div>
  </div>
  <div className="grid xl:grid-cols-2 xl:gap-6">
    <div className="relative z-0 w-full mb-6 group">
        <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer" placeholder=" " required />
        <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number (123-456-7890)</label>
    </div>
    <div className="relative z-0 w-full mb-6 group">
        <input type="text" name="floating_company" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer" placeholder=" " required />
        <label htmlFor="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company (Ex. Google)</label>
    </div> */}
  
  <div>
  <div className=" mb-3 text-sm text-gray-500">token distribution ratio:</div>


  <div className="flex items-center mb-2">
    <input id="country-option-4" type="radio" name="countries" className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-primary dark:focus-ring-primary dark:bg-gray-700 dark:border-gray-600" />
    <label htmlFor="country-option-4" className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      repository creator
    </label>
  </div>

  <div className="flex items-center mb-2">
    <input id="option-disabled" type="radio" name="countries" value="China" className="w-4 h-4 border-gray-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary dark:bg-gray-700 dark:border-gray-600" disabled/>
    <label htmlFor="option-disabled" className="block ml-2 text-sm font-medium text-gray-300 dark:text-gray-700">
      by amount of code contributed (coming soon)
    </label>
  </div>
  <div className="flex items-center mb-2">
    <input id="option-disabled" type="radio" name="countries" value="China" className="w-4 h-4 border-gray-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary dark:bg-gray-700 dark:border-gray-600" disabled />
    <label htmlFor="option-disabled" className="block ml-2 text-sm font-medium text-gray-300 dark:text-gray-700">
      by duration of project involvement (coming soon)
    </label>
  </div>
  </div>
  <div className=' mt-2 grid place-items-center'>
  <button type="submit" className="text-white bg-primary hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create DAO</button>
  </div>
  
</form>
    </div>
  )
};