async function loadProjects() {
  try {
    const { response, payload } = await apiGet('/CollegeProject/getAllProjects');
    const result = parseApiResponse(payload);

    if (response.ok && result.success) {
      const projects = Array.isArray(result.data || payload) ? (result.data || payload) : [result.data || payload];
      const tbody = document.getElementById('projectsTableBody');

      if (!projects.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-muted">No projects found.</td></tr>';
        return;
      }

      tbody.innerHTML = projects.map((project) => `
        <tr>
          <td>${project.projectId || project.id}</td>
          <td>${project.studentName || 'N/A'}</td>
          <td>${project.projectTitle || 'Untitled'}</td>
          <td>${project.department || 'N/A'}</td>
          <td>
            <select class="form-select form-select-sm status-select" data-project-id="${project.projectId || project.id}">
              <option value="Draft" ${project.status === 'Draft' ? 'selected' : ''}>Draft</option>
              <option value="Active" ${project.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Completed" ${project.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </td>
          <td>
            <a class="btn btn-outline-primary btn-sm" href="project-details.html?id=${project.projectId || project.id}">View</a>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.status-select').forEach((select) => {
        select.addEventListener('change', async (event) => {
          const projectId = event.target.dataset.projectId;
          const status = event.target.value;
          try {
            const { response: statusResponse, payload: statusPayload } = await apiGet(`/CollegeProject/changeProjectStatus?projectId=${projectId}&status=${encodeURIComponent(status)}`);
            const statusResult = parseApiResponse(statusPayload);
            if (statusResponse.ok && statusResult.success) {
              showAlert('success', 'Project status updated.');
              loadProjects();
            } else {
              showAlert('danger', statusResult.message || 'Could not update status.');
            }
          } catch (error) {
            console.error(error);
            showAlert('danger', 'Unable to update status.');
          }
        });
      });
    } else {
      showAlert('warning', result.message || 'Unable to load projects.');
    }
  } catch (error) {
    console.error(error);
    showAlert('danger', 'Unable to load projects.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;
  loadProjects();
});
