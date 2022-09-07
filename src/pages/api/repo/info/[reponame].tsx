import { Octokit } from "octokit";
import { NextApiRequest,NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const session = await getSession({ req });
    const octokit = new Octokit(
        {
            auth: session?.accessToken 
        }
    );
    const reponame:any = req.query.reponame;
    const [owner,repo] = reponame.split("!")

    const response = await octokit.request(`GET /repos/${owner}/${repo}`,{})
    
    res.status(200).json(response.data);
}