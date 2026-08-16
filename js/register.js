document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const button = document.getElementById('registerButton');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userName = document.getElementById('userName').value.trim();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;

    if (!userName || !password) {
      showAlert('warning', 'Username and password are required.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert('warning', 'Please enter a valid email address.');
      return;
    }

    setLoading(button, 'Creating account...');

    try {
      const { response, payload } = await apiPost('/CollegeProject/AddNewUser', {
        userName,
        password,
        email,
        role
      });

      const result = parseApiResponse(payload);

      if (response.ok && result.success) {
        showAlert('success', 'Account created successfully. Please login.');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1000);
      } else {
        showAlert('danger', result.message || 'Registration failed.');
      }
    } catch (error) {
      console.error(error);
      showAlert('danger', 'Unable to connect to the server. Please try again later.');
    } finally {
      resetLoading(button);
    }
  });
});
