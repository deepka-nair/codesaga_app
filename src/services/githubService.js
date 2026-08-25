// Real GitHub REST API Integration & Repository Publishing Service
// Communicates directly with official GitHub APIs (https://api.github.com)

export const fetchRealGithubProfile = async (identifier) => {
  if (!identifier || !identifier.trim()) {
    throw new Error('Please enter a valid GitHub username or Personal Access Token.');
  }

  const cleanInput = identifier.trim();
  const isToken = cleanInput.startsWith('ghp_') || cleanInput.startsWith('github_pat_');

  let headers = {
    'Accept': 'application/vnd.github.v3+json'
  };

  let userUrl = '';

  if (isToken) {
    headers['Authorization'] = `token ${cleanInput}`;
    userUrl = 'https://api.github.com/user';
  } else {
    // Remove url prefix if user pasted full URL (e.g., https://github.com/torvalds)
    const username = cleanInput.replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
    userUrl = `https://api.github.com/users/${encodeURIComponent(username)}`;
  }

  // Fetch User Metadata
  const userRes = await fetch(userUrl, { headers });

  if (userRes.status === 404) {
    throw new Error(`GitHub user "${cleanInput}" was not found on GitHub. Verify the username.`);
  }

  if (userRes.status === 401) {
    throw new Error('Invalid GitHub token provided. Check token permissions.');
  }

  if (userRes.status === 403) {
    throw new Error('GitHub API rate limit exceeded. Please wait a moment or use a Personal Access Token.');
  }

  if (!userRes.ok) {
    throw new Error(`GitHub API HTTP ${userRes.status}: Unable to fetch user profile.`);
  }

  const userData = await userRes.json();

  // Fetch Real Top Public Repositories
  const reposUrl = userData.repos_url 
    ? `${userData.repos_url}?sort=updated&per_page=6` 
    : `https://api.github.com/users/${encodeURIComponent(userData.login)}/repos?sort=updated&per_page=6`;

  let reposData = [];
  try {
    const reposRes = await fetch(reposUrl, { headers });
    if (reposRes.ok) {
      const rawRepos = await reposRes.json();
      if (Array.isArray(rawRepos)) {
        reposData = rawRepos.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description || 'No description provided.',
          language: r.language || 'Code',
          stargazers_count: r.stargazers_count || 0,
          forks_count: r.forks_count || 0,
          html_url: r.html_url,
          updated_at: new Date(r.updated_at).toLocaleDateString()
        }));
      }
    }
  } catch (err) {
    console.warn('Unable to fetch GitHub repositories list:', err);
  }

  return {
    login: userData.login,
    name: userData.name || userData.login,
    avatar_url: userData.avatar_url,
    html_url: userData.html_url,
    bio: userData.bio || 'CodeSaga Developer',
    location: userData.location || 'Global',
    company: userData.company || null,
    public_repos: userData.public_repos || reposData.length,
    followers: userData.followers || 0,
    following: userData.following || 0,
    repos: reposData,
    connected_at: new Date().toLocaleDateString()
  };
};

/**
 * Publish CodeSaga Project directly to user's GitHub Account
 */
export const publishProjectToGithub = async (tokenOrUsername, repoName, isPrivate, projectData) => {
  const isToken = tokenOrUsername?.startsWith('ghp_') || tokenOrUsername?.startsWith('github_pat_');
  
  if (!isToken) {
    throw new Error('Personal Access Token (PAT) with "repo" scope is required to create repositories on GitHub.');
  }

  const headers = {
    'Authorization': `token ${tokenOrUsername}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  // 1. Create Repository via GitHub REST API
  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: repoName,
      description: 'CodeSaga Programming Quests & RPG Capstone Solutions',
      private: isPrivate,
      auto_init: true
    })
  });

  let repoData;
  if (createRes.status === 422) {
    // Repository already exists
    const userRes = await fetch('https://api.github.com/user', { headers });
    const userJson = await userRes.json();
    const repoRes = await fetch(`https://api.github.com/repos/${userJson.login}/${repoName}`, { headers });
    if (!repoRes.ok) throw new Error(`Repository "${repoName}" exists but could not be accessed.`);
    repoData = await repoRes.json();
  } else if (!createRes.ok) {
    const errorJson = await createRes.json();
    throw new Error(`GitHub API Error: ${errorJson.message || 'Unable to create repository.'}`);
  } else {
    repoData = await createRes.json();
  }

  // 2. Commit README.md to GitHub
  const readmeContent = `# 🚀 CodeSaga Capstone Project: ${repoName}

Published directly from **CodeSaga RPG Programming Quests**.

## 🏆 Learner Progress & Achievements
- **Total XP**: ${projectData.xp || 0}
- **Player Level**: ${projectData.level || 1}
- **Completed Missions**: ${(projectData.completedMissions || []).length}
- **Completed Chapters**: ${(projectData.completedChapters || []).length}

## 💻 Tech Stack Mastered
- SQL Detective Databases
- Python Core Logic
- Java Object-Oriented Engineering
- C++ High-Performance Systems
- Frontend Web Crafting
- Backend Server Architecture

*Automated commit via CodeSaga GitHub Publisher.*
`;

  const encodedContent = btoa(unescape(encodeURIComponent(readmeContent)));

  await fetch(`https://api.github.com/repos/${repoData.owner.login}/${repoName}/contents/README.md`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'Initial commit: Publish CodeSaga Capstone Project',
      content: encodedContent
    })
  });

  return {
    success: true,
    html_url: repoData.html_url,
    name: repoData.name
  };
};
