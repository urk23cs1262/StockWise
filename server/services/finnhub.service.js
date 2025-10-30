import fetch from "node-fetch";
import { POPULAR_STOCK_SYMBOLS } from "../config/constants.js";
import {
  getDateRange,
  validateArticle,
  formatArticle,
  formatPrice,
  formatChangePercent,
  formatMarketCapValue,
} from "../utils/helpers.js";
import { FINNHUB_API_KEY, FINNHUB_BASE_URL } from "../config/env.js";

// Generic fetch wrapper
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return await res.json();
}

/**
 * Fetches company-specific news for provided symbols or general market news as a fallback.
 * @param {string[]} symbols - Array of stock symbols.
 * @returns {Promise<Object[]>} - Array of formatted news articles.
 */
export async function getNews(symbols = []) {
  try {
    const range = getDateRange(5);
    const token = FINNHUB_API_KEY;
    if (!token) throw new Error("FINNHUB API key not configured");

    const cleanSymbols = symbols.map((s) => s.trim().toUpperCase()).filter(Boolean);
    const maxArticles = 6;

    if (cleanSymbols.length > 0) {
      const perSymbolArticles = {};

      await Promise.all(
        cleanSymbols.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${sym}&from=${range.from}&to=${range.to}&token=${token}`;
            const articles = await fetchJSON(url);
            perSymbolArticles[sym] = (articles || []).filter(validateArticle);
          } catch (err) {
            console.error("Error fetching company news for", sym, err);
            perSymbolArticles[sym] = [];
          }
        })
      );

      const collected = [];
      for (let round = 0; round < maxArticles; round++) {
        for (const sym of cleanSymbols) {
          const list = perSymbolArticles[sym] || [];
          if (list.length === 0) continue;
          const article = list.shift();
          if (!article || !validateArticle(article)) continue;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }

      if (collected.length > 0) {
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
        return collected.slice(0, maxArticles);
      }
    }

    // Fallback: general market news
    const url = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
    const general = await fetchJSON(url);

    const seen = new Set();
    const unique = [];

    for (const art of general || []) {
      if (!validateArticle(art)) continue;
      const key = `${art.id}-${art.url}-${art.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(art);
      if (unique.length >= 20) break; // Unique up to 20 to select 6
    }

    return unique
      .slice(0, maxArticles)
      .map((a, idx) => formatArticle(a, false, undefined, idx));
  } catch (err) {
    console.error("getNews error:", err);
    throw new Error("Failed to fetch news");
  }
}

/**
 * Searches for stocks by query or returns popular stocks if query is empty.
 * @param {string} query - Search query.
 * @returns {Promise<Object[]>} - Array of stock search results.
 */
export async function searchStocks(query = "") {
  try {
    const token = FINNHUB_API_KEY;
    if (!token) {
      console.error("Missing FINNHUB API key");
      return [];
    }

    const trimmed = query.trim();
    let results = [];

    if (!trimmed) {
      const top = POPULAR_STOCK_SYMBOLS.slice(0, 10);
      const profiles = await Promise.all(
        top.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${sym}&token=${token}`;
            const profile = await fetchJSON(url);
            return { sym, profile };
          } catch {
            return { sym, profile: null };
          }
        })
      );

      results = profiles
        .map(({ sym, profile }) => {
          const name = profile?.name || profile?.ticker;
          const exchange = profile?.exchange || "US";
          if (!name) return null;
          return {
            symbol: sym,
            description: name,
            exchange,
            type: "Common Stock",
          };
        })
        .filter(Boolean);
    } else {
      const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(
        trimmed
      )}&token=${token}`;
      const data = await fetchJSON(url);
      results = Array.isArray(data?.result) ? data.result : [];
    }

    return results.slice(0, 15).map((r) => ({
      symbol: (r.symbol || "").toUpperCase(),
      name: r.description || r.symbol,
      exchange: r.exchange || "US",
      type: r.type || "Stock",
      isInWatchlist: false,
    }));
  } catch (err) {
    console.error("Error in stock search:", err);
    return [];
  }
}

// NOTE: Caching logic (e.g., `cache()`, time arguments in `fetchJSON`) has been removed
// as requested. Assumes `formatPrice`, `formatChangePercent`, and
// `formatMarketCapValue` are available in `../utils/helpers.js`.

/**
 * Fetches detailed stock data (quote, profile, financials) by symbol.
 * @param {string} symbol - The stock symbol.
 * @returns {Promise<Object>} - The structured stock detail object.
 */
export async function getStocksDetails(symbol) {
  const cleanSymbol = symbol.trim().toUpperCase();
  const token = FINNHUB_API_KEY;

  try {
    if (!token) {
      throw new Error("FINNHUB API key not configured");
    }

    const [quote, profile, financials] = await Promise.all([
      fetchJSON(
        `${FINNHUB_BASE_URL}/quote?symbol=${cleanSymbol}&token=${token}`
      ),
      fetchJSON(
        `${FINNHUB_BASE_URL}/stock/profile2?symbol=${cleanSymbol}&token=${token}`
      ),
      fetchJSON(
        `${FINNHUB_BASE_URL}/stock/metric?symbol=${cleanSymbol}&metric=all&token=${token}`
      ),
    ]);

    // Assuming quoteData, profileData, financialsData types for clarity
    const quoteData = quote;
    const profileData = profile;
    const financialsData = financials;

    // Check if we got valid quote and profile data
    if (!quoteData?.c || !profileData?.name) {
      // Use the ticker if name is missing but ticker is present
      if (!profileData?.ticker) {
        throw new Error("Invalid stock data received from API");
      }
    }

    const changePercent = quoteData.dp || 0;
    const peRatio = financialsData?.metric?.peNormalizedAnnual || null;

    return {
      symbol: cleanSymbol,
      company: profileData?.name || profileData?.ticker || cleanSymbol,
      currentPrice: quoteData.c,
      changePercent,
      priceFormatted: formatPrice(quoteData.c),
      changeFormatted: formatChangePercent(changePercent),
      peRatio: peRatio?.toFixed(1) || "—",
      marketCapFormatted: formatMarketCapValue(
        profileData?.marketCapitalization || 0
      ),
    };
  } catch (error) {
    console.error(`Error fetching details for ${cleanSymbol}:`, error);
    // Re-throw a generic error to be handled by the caller
    throw new Error("Failed to fetch stock details");
  }
}