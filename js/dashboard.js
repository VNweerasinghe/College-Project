document.addEventListener('DOMContentLoaded', async () => {
  if (!requireLogin()) return;

  const welcomeMessage = document.getElementById('welcomeMessage');
  const totalProjects = document.getElementById('totalProjects');
  const activeProjects = document.getElementById('activeProjects');
  const draftProjects = document.getElementById('draftProjects');

  const user = getCurrentUser();
  if (user) {
    welcomeMessage.textContent = `Welcome, ${user.userName || user.name || 'Student'}`;
  }

  try {
    const { response, payload } = await apiGet('/CollegeProject/getDashboard');
    const result = parseApiResponse(payload);

    if (response.ok && result.success) {
      const data = result.data || payload || {};
      totalProjects.textContent = data.totalProjects ?? data.total ?? 0;
      activeProjects.textContent = data.activeProjects ?? data.active ?? 0;
      draftProjects.textContent = data.draftProjects ?? data.draft ?? 0;
    } else {
      showAlert('warning', result.message || 'Unable to load dashboard data.');
    }
  } catch (error) {
    console.error(error);
    showAlert('danger', 'Unable to load dashboard information right now.');
  }
});
