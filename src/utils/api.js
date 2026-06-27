const API_BASE = "http://localhost:8080";

/**
 * Standard request helper with X-Student-Id session header
 */
async function apiRequest(endpoint, options = {}) {
  const studentId = localStorage.getItem('econav_student_id');
  
  const headers = {
    ...options.headers,
  };
  
  if (studentId) {
    headers['X-Student-Id'] = studentId;
  }

  // Handle JSON content type automatically
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  return response.json();
}

// ---------------- API Methods ----------------

export const api = {
  // --- Authentication ---
  async signup(name, email, phone) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);

    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: formData
    });
    
    if (data && data.id) {
      localStorage.setItem('econav_student_id', data.id);
    }
    return data;
  },

  async login(email) {
    const formData = new FormData();
    formData.append('email', email);

    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: formData
    });
    
    if (data && data.id) {
      localStorage.setItem('econav_student_id', data.id);
    }
    return data;
  },

  // --- Student Profile ---
  async fetchProfile() {
    return apiRequest('/students/me');
  },

  async createProfile(profileData) {
    // Map React profile fields to FastAPI schemas.StudentCreate
    const payload = {
      name: profileData.name,
      email: profileData.email || `${profileData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: profileData.phone || "+91 98765 43210",
      is_first_gen: profileData.firstGen === 'yes',
      state: profileData.state,
      course: profileData.academicLevel || "Undergrad",
      year_of_study: 1,
      annual_family_income: parseFloat(profileData.income) || 0.0,
      category: profileData.category || "General",
      disability_status: false,
      gender: profileData.gender || "Not Specified",
      preferred_language: localStorage.getItem('econav_language') || 'en',
      score: parseFloat(profileData.score) || 0.0
    };

    const data = await apiRequest('/students/me', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (data && data.id) {
      localStorage.setItem('econav_student_id', data.id);
    }
    return data;
  },

  async updateProfile(profileData) {
    const payload = {
      name: profileData.name,
      email: profileData.email || `${profileData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: profileData.phone || "+91 98765 43210",
      is_first_gen: profileData.firstGen === 'yes',
      state: profileData.state,
      course: profileData.academicLevel || "Undergrad",
      year_of_study: 1,
      annual_family_income: parseFloat(profileData.income) || 0.0,
      category: profileData.category || "General",
      disability_status: false,
      gender: profileData.gender || "Not Specified",
      preferred_language: localStorage.getItem('econav_language') || 'en',
      score: parseFloat(profileData.score) || 0.0
    };

    return apiRequest('/students/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  // --- Scholarships ---
  async fetchScholarships(eligibleOnly = false) {
    const query = eligibleOnly ? '?eligible_only=true' : '';
    return apiRequest(`/scholarships${query}`);
  },

  // --- Applications / Tracker ---
  async fetchApplications() {
    return apiRequest('/applications');
  },

  async applyScholarship(scholarshipId) {
    const payload = {
      scholarship_id: scholarshipId,
      status: "saved",
      applied_date: new Date().toLocaleDateString('en-IN')
    };

    return apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updateApplicationStatus(applicationId, status) {
    const payload = { status };
    return apiRequest(`/applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async deleteApplication(applicationId) {
    return apiRequest(`/applications/${applicationId}`, {
      method: 'DELETE'
    });
  },

  // --- Documents Upload & OCR ---
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest('/documents/upload', {
      method: 'POST',
      body: formData
    });
  },

  async fetchDocuments() {
    return apiRequest('/documents');
  },

  // --- Chatbot (RAG Query) ---
  async askChatbot(message) {
    const payload = { message };
    return apiRequest('/chatbot/query', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // --- Notifications ---
  async fetchNotifications() {
    return apiRequest('/notifications');
  }
};
