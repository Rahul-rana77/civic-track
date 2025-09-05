let allIssues = [];

async function fetchIssues() {
    try {
      const res = await fetch("http://localhost:8000/api/issues");
      const issues = await res.json();
      allIssues = issues;
      renderIssues(issues);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  }
  function renderIssues(issues) {
    const container = document.getElementById("issuesContainer");
    container.innerHTML = "";

    function getImageUrl(issue) {
  if (!issue.photoUrl) return 'https://via.placeholder.com/280x120?text=No+Image';
  if (issue.photoUrl.startsWith('/uploads')) {
    return `http://localhost:8000${issue.photoUrl}`;
  }
  if (issue.image.startsWith('uploads')) {
    return `http://localhost:8000/${issue.photoUrl}`;
  }
  return issue.photoUrl;
}

    issues.forEach(issue => {
      const card = document.createElement("a");
      card.className = "issue-card";
      card.href = `/client/issue-page/issue.html?id=${issue.id}`;
      card.innerHTML = `
      <img src="${getImageUrl(issue)}" alt="${issue.category}">
      <div class="issue-details">
      <h4>${issue.title}</h4>
      <p>Status: <span class="status ${issue.status?.toLowerCase().replace(' ', '-') || 'reported'}">${issue.status || 'Reported'}</span></p>
      <p>Date: ${new Date(issue.date || Date.now()).toLocaleDateString()}</p>
      <p>Location: ${issue.location}</p>`;
      container.appendChild(card);
    });
  }

    function searchIssues() {
      const query = document.getElementById("searchBar").value.toLowerCase();
      const filtered = issues.filter(issue =>
        issue.title.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query)
      );
      displayFilteredIssues(filtered);
    }

    function displayFilteredIssues(filteredIssues) {
      const container = document.getElementById("issuesContainer");
      container.innerHTML = "";

      filteredIssues.forEach(issue => {
        const card = document.createElement("a");
        card.className = "issue-card";
        card.href = `/client/issue-page/issue.html?id=${issue.id}`;
        card.innerHTML = `
          <img src="${issue.photoUrl}" alt="${issue.category}">
          <div class="issue-details">
            <h4>${issue.title}</h4>
            <p>Status: <span class="status ${issue.status.toLowerCase().replace(' ', '-')}">${issue.status}</span></p>
            <p>Date: ${issue.date}</p>
            <p>Location: ${issue.location}</p>
          </div>
        `;
        container.appendChild(card);
      });

      if (filteredIssues.length === 0) {
        container.innerHTML = "<p>No issues found.</p>";
      }
    }

    window.onload = fetchIssues;