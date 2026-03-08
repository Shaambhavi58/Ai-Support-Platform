const BASE_URL = "https://ai-support-platform-production.up.railway.app";

function getToken() {
  return localStorage.getItem("token");
}

async function request(method, path, body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = `Bearer ${getToken()}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.reload();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Auth
  login: (email, password) => request("POST", "/api/auth/login", { email, password }, false),
  register: (name, email, password) => request("POST", "/api/auth/register", { name, email, password }, false),
  getMe: () => request("GET", "/api/auth/me"),
  getUsers: () => request("GET", "/api/auth/users"),

  // Tickets
  getTickets: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/api/tickets${q ? "?" + q : ""}`);
  },
  getTicket: (id) => request("GET", `/api/tickets/${id}`),
  createTicket: (data) => request("POST", "/api/tickets", data),
  updateTicket: (id, data) => request("PATCH", `/api/tickets/${id}`, data),
  deleteTicket: (id) => request("DELETE", `/api/tickets/${id}`),
  addMessage: (ticketId, content, isCustomer = false) =>
    request("POST", `/api/tickets/${ticketId}/messages`, { content, is_customer: isCustomer }),
  suggestReply: (ticketId) => request("POST", `/api/ai/suggest/${ticketId}`),

  // Knowledge Base
  getArticles: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/api/kb${q ? "?" + q : ""}`);
  },
  getArticle: (id) => request("GET", `/api/kb/${id}`),
  createArticle: (data) => request("POST", "/api/kb", data),
  kbSearch: (query) => request("POST", "/api/ai/kb-search", { prompt: query, tone: "helpful", template: "reply" }),
  generateArticle: (title) => request("POST", "/api/ai/kb-article", { prompt: `Generate a help article for: "${title}"`, tone: "professional", template: "reply" }),

  // AI
  chat: (messages, sessionId) => request("POST", "/api/ai/chat", { messages, session_id: sessionId }, false),
  generateAI: (input, tone, template) => request("POST", "/api/ai/generate", { prompt: input, tone, template }),

  // Analytics
  getAnalytics: () => request("GET", "/api/analytics"),
};
