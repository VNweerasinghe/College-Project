async function loadProjectForEdit() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('editContent').innerHTML = '<div class="alert alert-warning">No project ID was provided.</div>';
    return;
  }

  try {
    const { response, payload } = await apiGet(`/CollegeProject/${id}`);
    const result = parseApiResponse(payload);

    if (response.ok && result.success) {
      const project = result.data || payload || {};
      document.getElementById('editContent').innerHTML = `
        <form id="editForm" class="needs-validation" novalidate>
          <div class="form-section">
            <h4>Student Information</h4>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Student Name</label>
                <input type="text" class="form-control" id="studentName" value="${project.studentName || ''}" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Contact Number</label>
                <input type="text" class="form-control" id="contactNo" value="${project.contactNo || ''}" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" id="emailId" value="${project.emailId || ''}" required />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>Project Information</h4>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Project Title</label>
                <input type="text" class="form-control" id="projectTitle" value="${project.projectTitle || ''}" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Department</label>
                <input type="text" class="form-control" id="department" value="${project.department || ''}" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Course</label>
                <input type="text" class="form-control" id="course" value="${project.course || ''}" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Technologies Used</label>
                <input type="text" class="form-control" id="technologies" value="${project.technologies || ''}" required />
              </div>
              <div class="col-12">
                <label class="form-label">Project Description</label>
                <textarea class="form-control" id="projectDescription" rows="4">${project.projectDescription || ''}</textarea>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>Project Dates</h4>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control" id="startDate" value="${formatDateForInput(project.startDate)}" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">End Date</label>
                <input type="date" class="form-control" id="endDate" value="${formatDateForInput(project.endDate)}" required />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>Project Type</h4>
            <div class="form-check mb-2">
              <input class="form-check-input" type="radio" name="projectType" id="individualProject" value="false" ${!project.isGroupProject ? 'checked' : ''} />
              <label class="form-check-label" for="individualProject">Individual Project</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="projectType" id="groupProject" value="true" ${project.isGroupProject ? 'checked' : ''} />
              <label class="form-check-label" for="groupProject">Group Project</label>
            </div>
            <div class="mt-3" id="groupMembersContainer" style="display: ${project.isGroupProject ? 'block' : 'none'};">
              <label class="form-label">Group Members</label>
              <textarea class="form-control" id="groupMembers" rows="3">${project.groupMembers || ''}</textarea>
            </div>
          </div>

          <div class="form-section">
            <h4>Synopsis and Links</h4>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="isSynopsisSubmitted" ${project.isSynopsisSubmitted ? 'checked' : ''} />
              <label class="form-check-label" for="isSynopsisSubmitted">Synopsis Submitted</label>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">GitHub URL</label>
                <input type="url" class="form-control" id="gitHubUrl" value="${project.gitHubUrl || ''}" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Live Demo URL</label>
                <input type="url" class="form-control" id="liveUrl" value="${project.liveUrl || ''}" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>Status</h4>
            <select class="form-select" id="status">
              <option value="Draft" ${project.status === 'Draft' ? 'selected' : ''}>Draft</option>
              <option value="Active" ${project.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Completed" ${project.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" id="updateButton">Update Project</button>
        </form>
      `;

      const individualProject = document.getElementById('individualProject');
      const groupProject = document.getElementById('groupProject');
      const groupMembersContainer = document.getElementById('groupMembersContainer');

      [individualProject, groupProject].forEach((radio) => {
        radio.addEventListener('change', () => {
          groupMembersContainer.style.display = groupProject.checked ? 'block' : 'none';
        });
      });

      document.getElementById('editForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = {
          studentName: document.getElementById('studentName').value.trim(),
          contactNo: document.getElementById('contactNo').value.trim(),
          emailId: document.getElementById('emailId').value.trim(),
          status: document.getElementById('status').value,
          projectTitle: document.getElementById('projectTitle').value.trim(),
          startDate: document.getElementById('startDate').value,
          endDate: document.getElementById('endDate').value,
          department: document.getElementById('department').value.trim(),
          course: document.getElementById('course').value.trim(),
          technologies: document.getElementById('technologies').value.trim(),
          isGroupProject: groupProject.checked,
          groupMembers: document.getElementById('groupMembers').value.trim(),
          isSynopsisSubmitted: document.getElementById('isSynopsisSubmitted').checked,
          projectDescription: document.getElementById('projectDescription').value.trim(),
          gitHubUrl: document.getElementById('gitHubUrl').value.trim(),
          liveUrl: document.getElementById('liveUrl').value.trim(),
          userId: getCurrentUserId()
        };

        const button = document.getElementById('updateButton');
        setLoading(button, 'Updating...');

        try {
          const { response, payload: responsePayload } = await apiPut(`/CollegeProject/${id}`, payload);
          const result = parseApiResponse(responsePayload);

          if (response.ok && result.success) {
            showAlert('success', 'Project updated successfully.');
            setTimeout(() => {
              window.location.href = `project-details.html?id=${id}`;
            }, 1000);
          } else {
            showAlert('danger', result.message || 'Unable to update project.');
          }
        } catch (error) {
          console.error(error);
          showAlert('danger', 'Unable to update project right now.');
        } finally {
          resetLoading(button);
        }
      });
    } else {
      document.getElementById('editContent').innerHTML = `<div class="alert alert-warning">${result.message || 'Project not found.'}</div>`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('editContent').innerHTML = '<div class="alert alert-danger">Unable to load project for editing.</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;
  loadProjectForEdit();
});
