const API_BASE_URL = typeof window !== 'undefined' ? '' : 'http://localhost:5000';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-expired'));
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Detect gateway/proxy failure (e.g. Vite proxy returning 500/502/504 when Flask backend is not running)
    if (response.status >= 500 && !data.error && !data.message) {
      throw new Error(
        'Backend server is not running or unreachable (http://localhost:5000). Please ensure the backend server is started using "python backend/main.py".'
      );
    }
    throw new Error(data.error || data.message || `Server returned error (${response.status})`);
  }
  return data;
};

const safeFetch = async (endpoint, options = {}, retries = 1) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {}),
      },
    });
    return await handleResponse(res);
  } catch (err) {
    // Retry once on momentary network glitch before giving up
    if (retries > 0 && (err.name === 'TypeError' || err.message === 'Failed to fetch' || err.message?.includes('NetworkError'))) {
      await new Promise((r) => setTimeout(r, 400));
      return safeFetch(endpoint, options, retries - 1);
    }
    if (err.name === 'TypeError' || err.message === 'Failed to fetch' || err.message?.includes('NetworkError')) {
      throw new Error(
        'Backend server is not running or unreachable (http://localhost:5000). Please ensure the backend server is started using "python backend/main.py".'
      );
    }
    throw err;
  }
};

export const api = {
  // Authentication & Profile
  login: async (email, password) => {
    const data = await safeFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email ? email.trim().toLowerCase() : '', password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (name, email, password, confirmPassword, targetRole, experienceLevel) => {
    const data = await safeFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name ? name.trim() : '',
        email: email ? email.trim().toLowerCase() : '',
        password,
        confirm_password: confirmPassword,
        confirmPassword: confirmPassword,
        target_role: targetRole,
        targetRole: targetRole,
        experience_level: experienceLevel,
        experienceLevel: experienceLevel,
      }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-expired'));
  },

  getProfile: async () => {
    return safeFetch('/api/user/profile', { method: 'GET' });
  },

  updateProfile: async (profileData) => {
    const data = await safeFetch('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Interviews Setup & Sessions
  getMarketQuestions: async (company = 'ALL') => {
    return safeFetch(`/api/market-questions?company=${encodeURIComponent(company)}`, {
      method: 'GET',
    });
  },

  createInterview: async (interviewData) => {
    return safeFetch('/api/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    });
  },

  getInterviews: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return safeFetch(`/api/interviews${queryStr}`, { method: 'GET' });
  },

  getInterviewDetails: async (id) => {
    return safeFetch(`/api/interviews/${id}`, { method: 'GET' });
  },

  submitAnswer: async (interviewId, questionId, userAnswer) => {
    return safeFetch(`/api/interviews/${interviewId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ question_id: questionId, user_answer: userAnswer }),
    });
  },

  completeInterview: async (interviewId) => {
    return safeFetch(`/api/interviews/${interviewId}/complete`, {
      method: 'POST',
    });
  },

  deleteInterview: async (interviewId) => {
    const url = interviewId ? `/api/interviews/${interviewId}` : '/api/interviews';
    return safeFetch(url, {
      method: 'DELETE',
    });
  },

  // Performance analytics
  getAnalytics: async () => {
    return safeFetch('/api/analytics', { method: 'GET' });
  },
};
