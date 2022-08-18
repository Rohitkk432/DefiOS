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
    const userinfo = await octokit.request(`GET /user`, {})
    const username = userinfo.data.login;

    const response = await octokit.request(`GET /users/${username}/repos`, {
        username: `${username}`
    })
    const results = response.data.map((repo:any) => ({
        name: repo.name,
        fullname: repo.full_name,
        description: repo.description,
        owner: repo.owner.login,
        visibility: repo.visibility,
        url: repo.html_url,
        created: repo.created_at,
        modified: repo.updated_at,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        openissues: repo.open_issues_count,
    }) )
    
    res.status(200).json(results);
}