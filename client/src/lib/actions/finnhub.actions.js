import axiosInstance from "@/api/axiosInstance";

export const searchStocks = async (query) => {
  console.log(query);
  try {
    const res = await axiosInstance.get("/stocks/search", {
      params: { q : query },
    });
    return res.data || [];
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return [];
  }
};

export const getNews = async (symbols = "") => {
  console.log('Fetching news for symbols:', symbols);
  try {
    const res = await axiosInstance.get("/stocks/news", {
      params: { symbols: symbols },
    });
    return res.data || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};


export const getStockDetails = async (symbol) => {
  console.log('Fetching details for stock:', symbol);
  if (!symbol) {
    console.error("Symbol is required to fetch stock details.");
    return null;
  }
  try {
    const res = await axiosInstance.get(`/stocks/details/${symbol}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching details for ${symbol}:`, error);
    throw new Error("Failed to load stock details.");
  }
};