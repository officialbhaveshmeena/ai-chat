import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001"
});

export const createSession = (userId) =>
  API.post("/session", { userId });

export const sendMessage = (data) =>
  API.post("/chat", data);

export const getSessions = (userId) =>
  API.get(`/sessions/${userId}`);

export const getHistory = (userId, sessionId) =>
  API.get(`/history?userId=${userId}&sessionId=${sessionId}`);