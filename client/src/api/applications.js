import api from "./axios";

export const getApplications = async (params) => {
  const response = await api.get("/applications", { params });
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (applicationData) => {
  const response = await api.post("/applications", applicationData);
  return response.data;
};

export const updateApplication = async (id, updates) => {
  const response = await api.put(`/applications/${id}`, updates);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};