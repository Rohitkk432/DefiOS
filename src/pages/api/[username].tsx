import { Octokit } from "octokit";

// @ts-ignore
export default async function handler(req, res) {

  const octokit = new Octokit(
    {
      auth: "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"
    }
  );
 const { username } = req.query;
  // eslint-disable-next-line no-template-curly-in-string
  const response = await octokit.request(`GET /users/${username}/repos`, {
    // eslint-disable-next-line no-template-curly-in-string
    username: `${username}`
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