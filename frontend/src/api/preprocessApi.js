import axios from "axios";

const RAW_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE_URL) ||
  "";

const API_BASE_URL = (RAW_BASE_URL || "").replace(/\/+$/, "");

const joinUrl = (base, path) => {
  if (!base) return path;
  const b = base.replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
};

export const preprocessDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      joinUrl(API_BASE_URL, "/preprocess"),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      }
    );

    const data = response.data || {};
    if (data.download_url && data.download_url.startsWith("/")) {
      data.download_url = joinUrl(API_BASE_URL, data.download_url);
    }
    return data;
  } catch (error) {
    const message =
      error?.response?.data?.detail ||
      error?.message ||
      "Failed to process dataset.";
    console.error("Error preprocessing dataset:", error);
    throw new Error(message);
  }
};
