import  useSWR from "swr";

// @ts-ignore
export async function GetRepo(user) {

  useSWR( 'repos', async() => {
    const res = await fetch(`http://localhost:3000/api/${user}/`)
    const data = await res.json()
    return { props: { data } }
  } )
}

// @ts-ignore
  export default function SelectRepo( {data} ) {

  return(

    <div>
      <ul>
        { data &&
        // @ts-ignore
        data.map((repo) =>
        (
          <li key={repo}>
            {repo.name} , {repo.url} , {repo.owner} , {repo.created} , {repo.stars} ,
          </li>
        )
        
        )}
      </ul>
    </div>
  )

        }


