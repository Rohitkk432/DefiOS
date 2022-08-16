import Canvas from '../components/Canvas';



export default function DaoCreated() {
  // const params = new URLSearchParams(window.location.search)

  // @ ts-ignore 
  // const da = params.get("daoaccountid")

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-console
  // console.log(da);
  return (
    <div className="grid place-items-center h-screen">
      <div><Canvas /></div>
      <div className=" text-3xl font-extrabold text-primary"> congrats! 🔥 </div>
      <div className="text-2xl font-semibold">
        your DAO has been created! 💡
      </div>
  
      <div>
        {/* Make this a link {https://explorer.testnet.near.org/accounts/ + params.get("daoaccountid")}  and use it below */}
        you can view your Repository DAO transaction on-chain here. ⛓ 
      </div>
    
      <div>
        {/* params.get("tokensymbol") this is token symbol use it below */}
        you should also have received 900,000 TokenSymbol tokens in your wallet.
      </div>
    
      <div>
        thank you for trying out the defiOS demo! 
      </div>
      <div>
        We have a long journey ahead, and we are glad to have you here with us in our quest to make open-source software sustainable for all! 
      </div>

      <div><Canvas /></div>
    </div>
  )
}