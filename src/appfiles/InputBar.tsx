import { useState } from "react";

// THIS WHOLE COMPONENT IS USELESS NOW. DIRECTLY GO TO pages/chooserepo

// import { useSession } from "next-auth/react";
// import GetRepo from "./GetRepo";

// @ts-ignore
export default function InputBar() {
  const [name, setName] = useState("");
 // const [repourl, setRepourl] = useState("");

  // @ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault();
    // eslint-disable-next-line no-console
     console.log(event.target)

    const user = event.target.name.value;
    // eslint-disable-next-line no-console
    console.log(user);
   //  const res = await fetch(`https://defi-os.com/api/${user}/`);
     const res = await fetch(`http://localhost:3000/api/${user}/`);
    const data = await res.json();
    setName(data);
    // eslint-disable-next-line no-console
    console.log(data);
    return { props: { data } };
  };

 // @ts-ignore
  const handleSelect = async (event2) => {
    // event2.preventDefault();
    // eslint-disable-next-line no-console
    // console.log(event2)
    const chosenRepo = event2;
    // eslint-disable-next-line no-console
    console.log(chosenRepo);
  };



  return (
    <div>

      <div className="flex justify-center items-center mt-4 pt-5 mb-4">
      
        <form onSubmit={handleSubmit}>
          <div className="relative z-0 w-full mb-6 group">
            <input
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer"
              placeholder=" "
              type="text"
              id="name"
              name="name"
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Github Username-
            </label>
          </div>
          <div className=" mt-2 grid place-items-center">
            <button
              type="submit"
              className="text-white bg-primary hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              submit
            </button>
          </div>
        </form>
      </div>

      <div>
        {name &&
        (
        <div className="flex justify-center items-center text-gray-500 ">
            select a repository-
        </div>
        )}
        <ul className=" p-4 mt-3 flex flex-row flex-wrap border-red-500">
          {name &&
            // @ts-ignore
            name.map((repo) => (
              <li
                key={repo}
                className="m-2 rounded-xl shadow-lg flex-grow p-4 hover:shadow-xl hover:scale-105 "
              >
                <div className="flex-col p-3">
                  <div className=" text-lg font-bold">{repo.name}</div>
                  <div className=" text-primary text-sm pb-4">
                    <a href={repo.url}>{repo.url}</a>
                    </div>
                  <div>{repo.owner}</div>
                  <div>{repo.created}</div>
                  <div>⭐️ {repo.stars}</div>
                </div>
                <div className="flex flex-row-reverse">
                  <button onClick={() => handleSelect(repo.url)}
                  className="text-white bg-primary hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >select</button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
