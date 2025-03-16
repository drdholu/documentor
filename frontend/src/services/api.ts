import axios from 'axios';
import io from 'socket.io-client';

const API_URL = import.meta.env.PROD ? 'https://your-api-url.com' : 'http://127.0.0.1:5000';
export const socket = io(API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const translateSummary = async (text: string, targetLang: string) => {
  return api.post('/translate', { text, target_lang: targetLang });
};

export const askQuestion = async (question: string, documentId: string) => {
  return api.post('/ask', { question, document_id: documentId });
};

export default api;