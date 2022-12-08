import { signIn, useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
const Globe = dynamic(import('../components/Globe'), { ssr: false });

interface HomepageProps { }

const Homepage: React.FC<HomepageProps> = ({ }) => {

  const { data: session } = useSession()
  const actionButtons = () => (
    <div className='flex gap-3'>
      <button className='text-[#90A9FC] border border-[#90A9FC] rounded font-semibold text-sm leading-3 px-4 py-2'>BUY</button>
      <button className='text-[#90A9FC] border border-[#90A9FC] rounded font-semibold text-sm leading-3 px-4 py-2'>SELL</button>
    </div>
  )

  const tableData = {
    columns: ["Name", "Price", "Contributors", "Buy Date", "Untility", "Actions"],
    rows: [
      { id: 1, name: "1.47 DoS", price: 5291.77, contributors: 1, buyDate: "in 6 months", untility: "BugFix", actions: actionButtons },
      { id: 2, name: "3.25 SNE", price: 5291.77, contributors: 1, buyDate: "in 6 months", untility: "Fix", actions: actionButtons },
      { id: 3, name: "6.22 FFx", price: 5291.77, contributors: 1, buyDate: "in 6 months", untility: "Header", actions: actionButtons },
      { id: 4, name: "4.21 LNX", price: 5291.77, contributors: 1, buyDate: "in 6 months", untility: "New Feature", actions: actionButtons },
      { id: 5, name: "1.28 GIMP", price: 5291.77, contributors: 1, buyDate: "in 6 months", untility: "Fix", actions: actionButtons },
      { id: 6, name: "1.57 CeL", price: 5291.77, contributors: 1, buyDate: "in 6 months", untility: "BugFix", actions: actionButtons },
    ]
  }
  return (
    <div className='min-h-full bg-red-500'>
      <div className='w-full h-screen homepageGradient px-[6%] py-[2%] text-white flex flex-col justify-start items-center'>
        <Head>
          <title>DefiOS</title>
        </Head>

        {/* navbar */}
        <div className='w-full flex flex-row justify-between items-center h-[7vh] z-20'>
          <img src="/assets/images/defi-os-logo.png" className='h-full' />
          <div className='flex flex-row justify-end items-center w-full h-full' >
            <a href='#' target="_blank" className='mx-[2%] text-[2vh] text-[#90A9FC] font-bold'>Alpha 🚀</a>
            <a href='#' target="_blank" className='mx-[2%] text-[2vh]'>For Projects 👨‍💻</a>
            <a href='#' target="_blank" className='mx-[2%] text-[2vh]'>For Entrepreneurs 🤔</a>
            <a href='#' target="_blank" className='mx-[2%] text-[2vh]'>For Enterprise 🏦</a>
            <a href="mailto:abhi@defi-os.com?Subject=Product%20Query" className='mx-[2%] text-[2vh]'>Contact Us</a>
          </div>
        </div>

        <div className='h-screen w-full hidden lg:flex flex-row-reverse items-center absolute z-10 overflow-hidden'>
          <Globe />
        </div>

        <div className='h-full w-full flex justify-start items-center z-20 px-[6%]'>
          <div className=''>
            <div className="flex flex-col justify-center items-start leading-[12vh] text-[10vh] font-semibold workSansFont w-full">
              <div>Tokenize Your</div>
              <div>Open Source</div>
              <div>Project</div>
            </div>
            <div className='flex flex-col justify-center items-center text-[2.3vh] w-[100%] m-auto my-[8%]'>
              <div className='flex flex-col justify-center items-start w-full'>
                <div className='text-[#9D9AA7]'>Discover the tokens of open-source</div>
                <div className='text-[#9D9AA7]'>infrastructure projects that are key to the</div>
                <div className='text-[#9D9AA7]'>developer ecosystem.</div>
              </div>
            </div>
            <div className='flex flex-row justify-start items-center w-full text-white text-[2vh] font-semibold'>

              {!session &&
                <button onClick={() => signIn('github', { callbackUrl: `${window.location.origin}/dashboard` })} className='bg-[#90A9FC] py-[2.5%] w-[40%] rounded-[0.75vh] mx-[2%] flex flex-row justify-center items-center' >
                  <div>Continue with GitHub</div>
                </button>
              }
              {session &&
                <Link href='/dashboard'>
                  <button className='bg-[#90A9FC] py-[2.5%] w-[40%] rounded-[0.75vh] mx-[2%] flex flex-row justify-center items-center' >
                    <div>Continue with GitHub</div>
                  </button>
                </Link>
              }

              <a href='#' target="_blank" className='py-[2.5%] w-[40%] rounded-[0.75vh] mx-[2%] flex flex-row justify-center items-center border' >
                <div>View Documentation</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full h-screen homepageGradient px-[6%] py-[2%] text-white flex flex-col justify-start items-center'>
        <div className="flex justify-center items-center leading-[12vh] text-[4vh] md:text-[5vh] lg:text-[6vh] font-bold workSansFont w-full">
          Every Repository has a Token
        </div>
        <div className='w-full flex justify-center overflow-auto'>
          <table className="glass-table table-auto w-[85%] xl:w-[70%]">
            <thead>
              <tr className='border-b border-b-slate-700'>
                {tableData.columns.map(col => (
                  <th key={col} className='text-start p-6 truncate'>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, index) => (
                <tr key={row.id} className={index < (tableData.rows.length - 1) ? 'border-b border-b-slate-700' : ""}>
                  <td className='px-5 py-4 truncate'>{row.name}</td>
                  <td className='px-5 py-4 truncate'>{row.price}</td>
                  <td className='px-5 py-4 truncate'>{row.contributors}</td>
                  <td className='px-5 py-4 truncate'>{row.buyDate}</td>
                  <td className='px-5 py-4 truncate'>{row.untility}</td>
                  <td className='px-5 py-4 truncate'>{row.actions()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className='bg-[#90A9FC] py-[1.5%] px-[2.5%] rounded font-semibold leading-5 text-[2vh] mt-12' >
          EXPLORE DEFIOS ALPHA 🚀
        </button>
      </div>
    </div>
  );
}

export default Homepage;
