const API_BASE_URL = 'http://localhost:8001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async checkHealth() {
    return this.request('/health');
  }

  async registerStudent(name) {
    return this.request('/student/register', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getPollStatus() {
    return this.request('/poll/status');
  }

  async createPoll(question, options, timeLimit = 60) {
    return this.request('/poll/create', {
      method: 'POST',
      body: JSON.stringify({ question, options, timeLimit }),
    });
  }

  async submitAnswer(studentId, answer) {
    return this.request('/poll/answer', {
      method: 'POST',
      body: JSON.stringify({ studentId, answer }),
    });
  }

  async getPollResults() {
    return this.request('/poll/results');
  }
}

export const apiService = new ApiService();