import Watchlist from "../models/watchlist.model.js";

export const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const watchlist = await Watchlist.findOne({ user: userId });
    if (!watchlist) {
      return res.status(200).json({ stocks: [] });
    }

    res.status(200).json(watchlist.stocks);
  } catch (err) {
    next(err);
  }
};

export const addToWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { symbol, company } = req.body;

    if (!symbol || !company) {
      return res.status(400).json({ message: "Symbol and company are required" });
    }

    let watchlist = await Watchlist.findOne({ user: userId });
    if (!watchlist) {
      watchlist = new Watchlist({ user: userId, stocks: [] });
    }

    const alreadyExists = watchlist.stocks.some((s) => s.symbol === symbol);
    if (alreadyExists) {
      return res.status(400).json({ message: "Stock already in watchlist" });
    }

    watchlist.stocks.push({ symbol, company });
    await watchlist.save();

    res.status(201).json({ message: "Stock added to watchlist", stocks: watchlist.stocks });
  } catch (err) {
    next(err);
  }
};


export const removeFromWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { symbol } = req.params;

    const watchlist = await Watchlist.findOne({ user: userId });
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    watchlist.stocks = watchlist.stocks.filter((s) => s.symbol !== symbol);
    await watchlist.save();

    res.status(200).json({ message: "Removed from watchlist", stocks: watchlist.stocks });
  } catch (err) {
    next(err);
  }
};
