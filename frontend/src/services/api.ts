import axios from 'axios';

const API_URL = import.meta.env.PROD ? 'https://your-api-url.com' : 'http://127.0.0.1:5000';

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

export const checkStatus = async (documentId: string) => {
  return api.get(`/status/${documentId}`);
};

export const summarizeDocument = async (filePath: string) => {
  return api.post('/summarize', { file_path: filePath });
};

export default api;
