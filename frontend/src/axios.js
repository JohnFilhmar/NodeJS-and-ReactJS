import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Store controllers for different requests
const controllers = new Map();

// Function to create and store an AbortController for a request
const createAbortController = (key) => {
  if (controllers.has(key)) {
    controllers.get(key).abort(); // Cancel previous request
  }
  const controller = new AbortController();
  controllers.set(key, controller);
  return controller.signal;
};

// Function to clear AbortController after request completes
const clearAbortController = (key) => {
  if (controllers.has(key)) {
    controllers.delete(key);
  }
};

// **Request Interceptor**: Attach an AbortController to every request
api.interceptors.request.use((config) => {
  config.signal = createAbortController(config.url);
  return config;
});

// **Response Interceptor (Success & Failure)**: Clear AbortController
api.interceptors.response.use(
  (response) => {
    clearAbortController(response.config.url);
    return response;
  },
  (error) => {
    if (error.config?.url) {
      clearAbortController(error.config.url);
    }
    return Promise.reject(error);
  }
);

export default api;