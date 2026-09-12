import api from "./api.js";

// Create a new interview
export const createInterview = async (interviewData) => {
  const response = await api.post("/interview/create", interviewData);
  return response.data;
};

// Get logged-in user's interview history
export const getUserHistory = async () => {
  const response = await api.get("/interview/user-history");
  return response.data;
};

// Get a single interview by ID
export const getInterviewById = async (interviewId) => {
  const response = await api.get(`/interview/${interviewId}`);
  return response.data;
};

// Upload and parse PDF resume
export const parseResume = async (resumeFile) => {
  const formData = new FormData();

  formData.append("resume", resumeFile);

  const response = await api.post("/resume/parse", formData);

  return response.data;
};