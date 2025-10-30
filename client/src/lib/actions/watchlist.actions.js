import axiosInstance from "@/api/axiosInstance";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getWatchlist = async () => {
  try {
    const res = await axiosInstance.get(`/watchlist`, {
      headers: getAuthHeaders(),
    });
    console.log("Watchlist API response:", res.data); 
    return res.data || [];
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
};

export const addToWatchlist = async (stock) => {
    console.log("stock: ");
    console.log(stock);
  try {
    const res = await axiosInstance.post(`/watchlist`, stock, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
};

export const removeFromWatchlist = async (symbol) => {
  try {
    const res = await axiosInstance.delete(`/watchlist/${symbol}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
};
