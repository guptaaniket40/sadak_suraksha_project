export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Normalizes backend image paths to full URLs pointing to API_BASE_URL.
 */
export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE_URL}${cleanPath}`;
};

