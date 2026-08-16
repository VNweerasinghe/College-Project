let allProjects = [];

function isCurrentUserAdmin() {
  return isAdminUser(getCurrentUser());
}

function renderProjects(projects) {
  const container = document.getElementById('projectsContent');
  if (!projects || projects.length === 0) {
    container.innerHTML = '<div class="alert alert-info">No projects found.</div>';
    return;
  }

  const rows = projects.map((project) => {
    const projectId = project.projectId || project.id;
    return `
      <div class="card mb-3">
        <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div>
            <h5 class="card-title mb-1">${project.projectTitle || 'Untitled Project'}</h5>
            <p class="mb-1 text-muted">${project.department || ''} • ${project.course || ''}</p>
            <p class="mb-1"><strong>Status:</strong> <span class="badge bg-info text-dark">${project.status || 'Draft'}</span></p>
            <p class="mb-0 text-muted">Student: ${project.studentName || 'N/A'} • ${formatDate(project.startDate)} to ${formatDate(project.endDate)}</p>
          </div>
          <div class="mt-3 mt-md-0">
            <a class="btn btn-outline-primary btn-sm" href="project-details.html?id=${projectId}">View</a>
            ${project.userId && String(project.userId) === String(getCurrentUserId()) ? `<a class="btn btn-outline-secondary btn-sm" href="edit-project.html?id=${projectId}">Edit</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = rows;
}

async function loadProjects(status = 'all') {
  const container = document.getElementById('projectsContent');
  const pageTitle = document.getElementById('projectsPageTitle');
  const pageSubtitle = document.getElementById('projectsPageSubtitle');

  if (pageTitle) {
    pageTitle.textContent = isCurrentUserAdmin() ? 'All Projects' : 'My Projects';
  }

  if (pageSubtitle) {
    pageSubtitle.textContent = isCurrentUserAdmin()
      ? 'Review projects submitted by all students.'
      : 'View and manage your submitted projects.';
  }

  container.innerHTML = '<div class="text-muted">Loading projects...</div>';

  try {
    let response;
    let payload;
    let projects = [];

    if (isCurrentUserAdmin()) {
      if (status === 'all') {
        ({ response, payload } = await apiGet('/CollegeProject/getAllProjects'));
      } else {
        ({ response, payload } = await apiGet(`/CollegeProject/getProjectByStatus?status=${encodeURIComponent(status)}`));
      }
    } else {
      const userId = getCurrentUserId();
      ({ response, payload } = await apiGet(`/CollegeProject/getProjectByUser?userId=${encodeURIComponent(userId)}`));
      const result = parseApiResponse(payload);
      const data = result.data || payload || [];
      projects = Array.isArray(data) ? data : [data];

      if (status !== 'all') {
        projects = projects.filter((project) => (project.status || 'Draft') === status);
      }

      allProjects = projects;
      renderProjects(projects);
      return;
    }

    const result = parseApiResponse(payload);

    if (response.ok && result.success) {
      const data = result.data || payload || [];
      projects = Array.isArray(data) ? data : [data];
      allProjects = projects;
      renderProjects(projects);
    } else {
      showAlert('warning', result.message || 'Unable to load projects.');
    }
  } catch (error) {
    console.error(error);
    showAlert('danger', 'Unable to load projects.');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!requireLogin()) return;

  const filter = document.getElementById('statusFilter');
  filter.addEventListener('change', () => loadProjects(filter.value));
  await loadProjects('all');
});
