import axios from "axios";

const BE_HOST = import.meta.env.VITE_BE_HOST;

const api = axios.create({
  baseURL: `${BE_HOST}/api`,
  withCredentials: true,
});

function getAccessToken() {
  return localStorage.getItem("token");
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRrefreshed(newToken: string) {
  refreshSubscribers.map((cb) => cb(newToken));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, chờ token mới rồi retry request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh
        const { data } = await axios.post(
          `${BE_HOST}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        console.log("New token", data.accessToken);
        const newAccessToken = data.accessToken;
        localStorage.setItem("token", newAccessToken);

        // Retry các request đang chờ
        onRrefreshed(newAccessToken);

        // Retry request hiện tại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh token hết hạn → logout
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
