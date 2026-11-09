import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("please look here ya amer >>>>>>>", BASE_URL);
// export function getBaseUrl(url: string) {
//   if( !url )  return `/${location.pathname.split("/")[1]}/`;
//   if (url.startsWith("/")) {
//     url = url.replace("/", "");
//   }
//   return `/${location.pathname.split("/")[1]}/${url}`;
// }

export function getBaseUrl(url: string) {
  if (url) {
    return url;
  }
  return "/api/";
}

const api = axios.create({
  baseURL: (BASE_URL),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-api-client": "rcm-app-v1",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// !!!
// export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
//   try {
//     const [url, config] = Array.isArray(args) ? args : [args];
//     const res = await api.get(url, { ...config });

//     return res.data;
//   } catch (error) {
//     console.error('Failed to fetch:', error);
//     throw error;
//   }
// };

export default api;
