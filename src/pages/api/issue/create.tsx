import { Octokit } from "octokit";
import { NextApiRequest,NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    const session = await getSession({ req });
    const octokit = new Octokit(
        {
            auth: (session as any)?.accessToken 
        }
    );
    const {title, body, labels, owner, repo } = req.body;
    const response = await octokit.request(`POST /repos/${owner}/${repo}/issues`, {
        owner: owner,
        repo: repo,
        title: title,
        body: body,
        labels: labels
    })
    
    res.status(200).json(response);
}