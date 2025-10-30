// // src/context/WatchlistContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";
// import { getWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";

// const WatchlistContext = createContext();

// export const WatchlistProvider = ({ children }) => {
//   const [watchlist, setWatchlist] = useState([]);

//   useEffect(() => {
//     const fetchWatchlist = async () => {
//       const list = await getWatchlist();
//       setWatchlist(list);
//     };
//     fetchWatchlist();
//   }, []);

//   const addStock = async (stock) => {
//     const res = await addToWatchlist(stock);
//     if (res?.success) {
//       setWatchlist((prev) => [...prev, stock]);
//     }
//     return res;
//   };

//   const removeStock = async (symbol) => {
//     const res = await removeFromWatchlist(symbol);
//     if (res?.success) {
//       setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
//     }
//     return res;
//   };

//   const isInWatchlist = (symbol) =>
//     watchlist.some((item) => item.symbol === symbol.toUpperCase());

//   return (
//     <WatchlistContext.Provider
//       value={{ watchlist, addStock, removeStock, isInWatchlist }}
//     >
//       {children}
//     </WatchlistContext.Provider>
//   );
// };

// export const useWatchlist = () => useContext(WatchlistContext);


import { createContext, useContext, useEffect, useState } from "react";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load the user's watchlist once on mount
  useEffect(() => {
    const fetchWatchlist = async () => {
      const list = await getWatchlist();
      setWatchlist(list || []);
      setLoading(false);
    };
    fetchWatchlist();
  }, []);

  // Check if symbol is in watchlist
  const isInWatchlist = (symbol) => {
    return watchlist.some((item) => item.symbol === symbol.toUpperCase());
  };

  // Add stock
  const addStock = async ({ symbol, company }) => {
    const result = await addToWatchlist({ symbol, company });
    if (result?.success) {
      // ✅ Update local state immediately
      setWatchlist((prev) => [...prev, { symbol, company }]);
    }
    return result;
  };

  // Remove stock
  const removeStock = async (symbol) => {
    const result = await removeFromWatchlist(symbol);
    if (result?.success) {
      // ✅ Remove from local state instantly
      setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol.toUpperCase()));
    }
    return result;
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        loading,
        isInWatchlist,
        addStock,
        removeStock,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);

