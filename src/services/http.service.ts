import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";
import { getAccessToken } from "@/services/auth.service";

export const axiosInstance = axios.create();

interface MiscellaneousRequestParams {
  contentType?: string;
  isPublic?: boolean;
  responseType?: ResponseType;
}

interface CommonAxiosParams extends MiscellaneousRequestParams {
  method: string;
  url: string;
  data?: unknown;
}

/**
 * Single place baseURL, auth header and content-type get attached — every
 * request (mock or real) funnels through here, mirroring the `mmscan`
 * frontend's `commonAxios`.
 */
function commonAxios<T>(config: CommonAxiosParams): Promise<T> {
  const { method, url, data, contentType = "application/json", isPublic = false, responseType } = config;

  const headers: Record<string, string> = { "Content-Type": contentType, 'ngrok-skip-browser-warning': 'true' };
  if (!isPublic) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const requestConfig: AxiosRequestConfig = {
    method,
    baseURL: import.meta.env.VITE_API_BASE_URL,
    url,
    headers,
    data,
    responseType,
  };

  return axiosInstance(requestConfig).then((response: AxiosResponse<T>) => response.data);
}

const get = <T>(url: string, otherData: MiscellaneousRequestParams = {}) =>
  commonAxios<T>({ method: "GET", url, ...otherData });

const post = <T>(url: string, data: unknown = {}, otherData: MiscellaneousRequestParams = {}) =>
  commonAxios<T>({ method: "POST", url, data, ...otherData });

const put = <T>(url: string, data: unknown = {}, otherData: MiscellaneousRequestParams = {}) =>
  commonAxios<T>({ method: "PUT", url, data, ...otherData });

const patch = <T>(url: string, data: unknown = {}, otherData: MiscellaneousRequestParams = {}) =>
  commonAxios<T>({ method: "PATCH", url, data, ...otherData });

const deleteRequest = <T>(url: string, otherData: MiscellaneousRequestParams = {}) =>
  commonAxios<T>({ method: "DELETE", url, ...otherData });

const httpService = { get, post, put, patch, deleteRequest };

export default httpService;
