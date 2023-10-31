class GitHubService {
    async getUser(username) {
        const token = '====';  // 개인 github 토큰 값
  
        const userProfileResponse = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        const userProfile = await userProfileResponse.json();
  
        const userReposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=desc&per_page=7`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        const userRepos = await userReposResponse.json();
  
        return {
            profile: userProfile,
            repos: userRepos
        };
    }
  }
  
  
  class UI {
    showProfile(user) {
        document.getElementById('user-avatar').src = user.avatar_url;
        document.getElementById('public-repos').textContent = user.public_repos;
        document.getElementById('public-gists').textContent = user.public_gists;
        document.getElementById('followers').textContent = user.followers;
        document.getElementById('following').textContent = user.following;
        document.getElementById('company').textContent = user.company || 'Not Available';
        document.getElementById('blog').textContent = user.blog || 'Not Available';
        document.getElementById('location').textContent = user.location || 'Not Available';
        document.getElementById('member-since').textContent = new Date(user.created_at).toDateString();
    }
  
    showRepos(repos) {
        const reposDiv = document.getElementById('repos');
        reposDiv.innerHTML = ''; 
        repos.forEach(repo => {
            reposDiv.innerHTML += `
                <div class="repo">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <span class="stars" style="background-color: rgb(84, 129, 228, 0.8);">Stars : ${repo.stargazers_count}</span>
                    <span class="watchers" style="background-color: rgb(174, 181, 188, 0.8);">Watchers : ${repo.watchers_count}</span>
                    <span class="forks" style="background-color: rgb(83, 182, 122, 0.8);">Forks : ${repo.forks_count}</span>
                </div>
            `;
        });
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.search-box input');
    const githubService = new GitHubService();
    const ui = new UI();
  
    input.addEventListener('keyup', async (e) => {
        const username = e.target.value.trim();
        if (username) {
            try {
                const data = await githubService.getUser(username);
                ui.showProfile(data.profile);
                ui.showRepos(data.repos);
            } catch (error) {
                console.log('Error:', error);
            }
        }
    });
  });
  