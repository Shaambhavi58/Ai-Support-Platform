const BASE_URL = "https://ai-support-platform-production.up.railway.app";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  getMe: () => request("/auth/me"),

  getTickets: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/tickets${qs ? "?" + qs : ""}`);
  },

  getTicket: (id) => request(`/tickets/${id}`),

  createTicket: (data) =>
    request("/tickets", { method: "POST", body: JSON.stringify(data) }),

  updateTicket: (id, data) =>
    request(`/tickets/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteTicket: (id) => request(`/tickets/${id}`, { method: "DELETE" }),

  addMessage: (ticketId, content, isCustomer = false) =>
    request(`/tickets/${ticketId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, is_customer: isCustomer }),
    }),

  suggestReply: (ticketId) =>
    request(`/tickets/${ticketId}/suggest-reply`, { method: "POST" }),

  getArticles: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/knowledge-base${qs ? "?" + qs : ""}`);
  },

  getArticle: (id) => request(`/knowledge-base/${id}`),

  createArticle: (data) =>
    request("/knowledge-base", { method: "POST", body: JSON.stringify(data) }),

  kbSearch: (query) =>
    request("/knowledge-base/ai-search", { method: "POST", body: JSON.stringify({ query }) }),

  generateArticle: (title) =>
    request("/knowledge-base/generate", { method: "POST", body: JSON.stringify({ title }) }),

  chat: (messages, sessionId = null) =>
    request("/ai/chat", { method: "POST", body: JSON.stringify({ messages, session_id: sessionId }) }),

  generateAI: (input, tone, template) =>
    request("/ai/generate", { method: "POST", body: JSON.stringify({ input, tone, template }) }),

  getAnalytics: () => request("/analytics/dashboard"),
};
