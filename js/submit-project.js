document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;

  const individualProject = document.getElementById('individualProject');
  const groupProject = document.getElementById('groupProject');
  const groupMembersContainer = document.getElementById('groupMembersContainer');
  const form = document.getElementById('projectForm');
  const button = document.getElementById('submitButton');

  [individualProject, groupProject].forEach((radio) => {
    radio.addEventListener('change', () => {
      groupMembersContainer.style.display = groupProject.checked ? 'block' : 'none';
    });
  });

  function validateForm() {
    const requiredFields = ['studentName', 'contactNo', 'emailId', 'projectTitle', 'startDate', 'endDate', 'department', 'course', 'technologies'];
    let isValid = true;

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
      }
    });

    const contactNo = document.getElementById('contactNo').value.trim();
    if (contactNo && !/^\d{10}$/.test(contactNo)) {
      document.getElementById('contactNo').classList.add('is-invalid');
      isValid = false;
    }

    const email = document.getElementById('emailId').value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('emailId').classList.add('is-invalid');
      isValid = false;
    }

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (startDate && endDate && endDate < startDate) {
      document.getElementById('endDate').classList.add('is-invalid');
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showAlert('warning', 'Please check the highlighted fields and try again.');
      return;
    }

    const user = getCurrentUser();
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
      userId: getCurrentUserId(user)
    };

    setLoading(button, 'Submitting...');

    try {
      const { response, payload: responsePayload } = await apiPost('/CollegeProject/SubmitProject', payload);
      const result = parseApiResponse(responsePayload);

      if (response.ok && result.success) {
        showAlert('success', 'Project submitted successfully.');
        setTimeout(() => {
          window.location.href = 'projects.html';
        }, 1000);
      } else {
        showAlert('danger', result.message || 'Unable to submit project.');
      }
    } catch (error) {
      console.error(error);
      showAlert('danger', 'Unable to connect to the server. Please try again later.');
    } finally {
      resetLoading(button);
    }
  });
});
