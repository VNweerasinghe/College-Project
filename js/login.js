document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const button = document.getElementById('loginButton');

  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userName = document.getElementById('userName').value.trim();
    const password = document.getElementById('password').value;

    if (!userName || !password) {
      showAlert('warning', 'Please enter your username and password.');
      return;
    }

    setLoading(button, 'Logging in...');

    try {
      const { response, payload } = await apiPost('/CollegeProject/login', {
        userName,
        password
      });

      const result = parseApiResponse(payload);

      if (response.ok && result.success) {
        const userData = result.data || payload;
        sessionStorage.setItem('user', JSON.stringify(userData));
        window.location.href = 'dashboard.html';
      } else {
        showAlert('danger', result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      showAlert('danger', 'Unable to connect to the server. Please try again later.');
    } finally {
      resetLoading(button);
    }
  });
});
