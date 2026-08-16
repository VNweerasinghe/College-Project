function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem('user'));
  } catch (error) {
    return null;
  }
}

function isLoggedIn() {
  return Boolean(getCurrentUser());
}

function getCurrentUserId(user = getCurrentUser()) {
  if (!user) return null;

  return user.userId || user.id || user.userID || user.UserId || user.UserID || null;
}

function isAdminUser(user = getCurrentUser()) {
  if (!user) return false;

  const roleValue = `${user.role || user.roleName || user.userRole || ''}`.toLowerCase();
  return roleValue.includes('admin') || roleValue.includes('supervisor');
}

function logout() {
  sessionStorage.removeItem('user');
  window.location.href = 'login.html';
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

function updateNavbar() {
  const user = getCurrentUser();
  const userNameElement = document.getElementById('navUserName');
  const manageProjectsLink = document.getElementById('manageProjectsLink');

  if (userNameElement) {
    userNameElement.textContent = user ? `Hello, ${user.userName || user.name || 'Student'}` : 'Guest';
  }

  if (manageProjectsLink) {
    manageProjectsLink.style.display = isAdminUser(user) ? 'block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      logout();
    });
  }
});
