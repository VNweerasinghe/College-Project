// Configure this once for your coursework API.
// If the API is hosted on the same server, '/api' is usually enough.
// You can also override it at runtime with window.API_BASE = 'http://localhost:5000/api'.
const DEFAULT_API_BASE = '/api';
let API_BASE = (window.API_BASE || DEFAULT_API_BASE).trim().replace(/\/+$/, '');

if (/your-api-domain/i.test(API_BASE)) {
  API_BASE = DEFAULT_API_BASE;
}

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = API_BASE || DEFAULT_API_BASE;
  return `${baseUrl}${normalizedPath}`;
}

async function apiRequest(path, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  return {
    response,
    payload
  };
}

async function apiGet(path) {
  const { response, payload } = await apiRequest(path, { method: 'GET' });
  return { response, payload };
}

async function apiPost(path, body) {
  const { response, payload } = await apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  return { response, payload };
}

async function apiPut(path, body) {
  const { response, payload } = await apiRequest(path, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
  return { response, payload };
}

async function apiDelete(path) {
  const { response, payload } = await apiRequest(path, { method: 'DELETE' });
  return { response, payload };
}

function parseApiResponse(payload) {
  if (payload && typeof payload === 'object' && 'result' in payload) {
    return {
      success: payload.result === true,
      message: payload.message || '',
      data: payload.data
    };
  }

  return {
    success: true,
    message: '',
    data: payload
  };
}

function formatDate(dateValue) {
  if (!dateValue) return 'Not provided';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatDateForInput(dateValue) {
  if (!dateValue) return '';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toISOString().split('T')[0];
}

function showAlert(type, message) {
  const container = document.getElementById('alertContainer');

  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

function setLoading(button, text) {
  if (!button) return;

  button.disabled = true;
  button.dataset.originalText = button.innerHTML;
  button.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    ${text}
  `;
}

function resetLoading(button) {
  if (!button || !button.dataset.originalText) return;

  button.disabled = false;
  button.innerHTML = button.dataset.originalText;
}
