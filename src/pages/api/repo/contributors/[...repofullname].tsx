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
    const repoFullName = req.query.repofullname[0] +'/'+ req.query.repofullname[1];

    const response = await octokit.request(`GET /repos/${repoFullName}/contributors`, {})
    
    res.status(200).json(response.data);
}