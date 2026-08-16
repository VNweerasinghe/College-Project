async function loadProjectDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('detailsContent').innerHTML = '<div class="alert alert-warning">No project ID was provided.</div>';
    return;
  }

  try {
    const { response, payload } = await apiGet(`/CollegeProject/${id}`);
    const result = parseApiResponse(payload);

    if (response.ok && result.success) {
      const project = result.data || payload || {};
      document.getElementById('projectTitleText').textContent = project.projectTitle || 'Project Details';

      const currentUserId = getCurrentUserId();
      const owner = String(project.userId || '') === String(currentUserId || '');

      if (owner) {
        document.getElementById('editButton').style.display = 'inline-block';
        document.getElementById('deleteButton').style.display = 'inline-block';
        document.getElementById('editButton').href = `edit-project.html?id=${id}`;
      }

      document.getElementById('deleteButton').addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
          const { response: deleteResponse, payload: deletePayload } = await apiDelete(`/CollegeProject/${id}`);
          const deleteResult = parseApiResponse(deletePayload);

          if (deleteResponse.ok && deleteResult.success) {
            showAlert('success', 'Project deleted successfully.');
            setTimeout(() => {
              window.location.href = 'projects.html';
            }, 1000);
          } else {
            showAlert('danger', deleteResult.message || 'Unable to delete project.');
          }
        } catch (error) {
          console.error(error);
          showAlert('danger', 'Unable to delete project right now.');
        }
      });

      document.getElementById('detailsContent').innerHTML = `
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="card p-4">
              <h4 class="mb-3">Project Summary</h4>
              <p><strong>Student Name:</strong> ${project.studentName || 'N/A'}</p>
              <p><strong>Contact Number:</strong> ${project.contactNo || 'N/A'}</p>
              <p><strong>Email:</strong> ${project.emailId || 'N/A'}</p>
              <p><strong>Status:</strong> <span class="badge bg-info text-dark">${project.status || 'Draft'}</span></p>
              <p><strong>Department:</strong> ${project.department || 'N/A'}</p>
              <p><strong>Course:</strong> ${project.course || 'N/A'}</p>
              <p><strong>Technologies:</strong> ${project.technologies || 'N/A'}</p>
              <p><strong>Start Date:</strong> ${formatDate(project.startDate)}</p>
              <p><strong>End Date:</strong> ${formatDate(project.endDate)}</p>
              <p><strong>Group Project:</strong> ${project.isGroupProject ? 'Yes' : 'No'}</p>
              <p><strong>Group Members:</strong> ${project.groupMembers || 'N/A'}</p>
              <p><strong>Synopsis Submitted:</strong> ${project.isSynopsisSubmitted ? 'Yes' : 'No'}</p>
              <p><strong>Description:</strong> ${project.projectDescription || 'No description provided.'}</p>
              <p><strong>GitHub URL:</strong> ${project.gitHubUrl ? `<a href="${project.gitHubUrl}" target="_blank">${project.gitHubUrl}</a>` : 'N/A'}</p>
              <p><strong>Live Demo URL:</strong> ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank">${project.liveUrl}</a>` : 'N/A'}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      document.getElementById('detailsContent').innerHTML = `<div class="alert alert-warning">${result.message || 'Project not found.'}</div>`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('detailsContent').innerHTML = '<div class="alert alert-danger">Unable to load project details.</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;
  loadProjectDetails();
});
