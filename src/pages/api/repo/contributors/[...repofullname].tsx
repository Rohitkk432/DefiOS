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
    let repoFullName = '';
    if (req) {
        if(req.query){
            if(req.query.repofullname){
                repoFullName = req.query.repofullname[0]?.toLowerCase()+'/'+req.query.repofullname[1]?.toLowerCase();
            }
        }
    }

    const response = await octokit.request(`GET /repos/${repoFullName}/stats/contributors`, {})
    
    res.status(200).json(response.data);
}