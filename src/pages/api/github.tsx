import { Octokit } from "octokit";

// @ts-ignore
export default async function handler(req, res) {

  const octokit = new Octokit(
    {
      auth: "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"
    }
  );

  const response = await octokit.request("GET /users/nateshirley/repos" , {
    username: 'nateshirley'
  })
  // q: 'is:issue is:open label:"EddieHub:good-first-issue"'
  // @ts-ignore
  const results = response.data.map((repo) => ({
    name: repo.name,
    owner: repo.owner.login,
    url: repo.html_url,
    created: repo.created_at,
    modified: repo.updated_at,
    stars: repo.stargazers_count,
    watchers: repo.watchers_count,
    openissues: repo.open_issues_count,
   }) )
   

  res.status(200).json(results);
}