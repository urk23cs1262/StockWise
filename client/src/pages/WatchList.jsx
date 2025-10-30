import { useEffect, useState, useRef } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchCommand from "@/components/SearchCommand";
import WatchlistButton from "@/components/WatchlistButton";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import { getStockDetails, searchStocks, getNews } from "@/lib/actions/finnhub.actions";

const WATCHLIST_TABLE_HEADER = [
  "Company",
  "Symbol",
  "Price",
  "Change",
  "Market Cap",
  "P/E Ratio",
  "Remove",
];

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [stockDetails, setStockDetails] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialStocks, setInitialStocks] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const list = await getWatchlist();
        if (!Array.isArray(list) || list.length === 0) {
          setWatchlist([]);
          setLoading(false);
          return;
        }

        setWatchlist(list);

        const details = await Promise.allSettled(
          list.map((item) => getStockDetails(item.symbol))
        );

        const validDetails = details
          .filter((d) => d.status === "fulfilled")
          .map((d) => d.value);

        setStockDetails(validDetails);

        const symbols = list.map((item) => item.symbol).join(",");
        if (symbols) {
          const newsData = await getNews(symbols);
          setNews(newsData);
        }

        const stocks = await searchStocks("");
        setInitialStocks(stocks);
      } catch (err) {
        console.error("Error loading watchlist:", err);
        toast.error("Failed to load watchlist");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemove = (symbol) => {
    setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
    setStockDetails((prev) => prev.filter((s) => s.symbol !== symbol));
  };

  const groupedNews = news.reduce((acc, article) => {
    const sym = article.related || "Other";
    if (!acc[sym]) acc[sym] = [];
    acc[sym].push(article);
    return acc;
  }, {});

  if (!loading && watchlist.length === 0) {
    return (
      <section className="flex watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Start building your watchlist by searching for stocks and clicking the star icon to add them.
          </p>
        </div>
        <SearchCommand initialStocks={initialStocks} />
      </section>
    );
  }

  return (
    <section className="watchlist max-w-[85vw] mx-auto mt-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table Section */}
        <div className="flex-1 lg:max-w-[75%]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="watchlist-title">Watchlist</h2>
            <SearchCommand initialStocks={initialStocks} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-[60vh] text-gray-400">
              Loading your watchlist...
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    {WATCHLIST_TABLE_HEADER.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockDetails.map((stock, i) => (
                    <TableRow key={i}>
                      <TableCell>{stock.company || "—"}</TableCell>
                      <TableCell>{stock.symbol}</TableCell>
                      <TableCell>
                        {stock.priceFormatted ||
                          `$${stock.currentPrice?.toFixed(2)}` ||
                          "—"}
                      </TableCell>
                      <TableCell
                        className={
                          stock.changePercent >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {stock.changeFormatted ||
                          `${stock.changePercent?.toFixed(2)}%` ||
                          "—"}
                      </TableCell>
                      <TableCell>{stock.marketCapFormatted || "—"}</TableCell>
                      <TableCell>{stock.peRatio || "—"}</TableCell>
                      <TableCell>
                        <WatchlistButton
                          symbol={stock.symbol}
                          company={stock.company}
                          isInWatchlist={true}
                          onWatchlistChange={(_, added) => {
                            if (!added) handleRemove(stock.symbol);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex-1 lg:max-w-[25%]">
          <h3 className="text-xl font-semibold mb-4">News</h3>

          {loading ? (
            <div className="flex justify-center items-center h-[60vh] text-gray-400">
              Loading news...
            </div>
          ) : news.length === 0 ? (
            <p className="text-gray-400">No recent news for your watchlist.</p>
          ) : (
            <div className="space-y-6 max-h-[80vh] overflow-y-auto scrollbar-hide-default pr-2">
              {Object.keys(groupedNews).map((symbol) => (
                <div key={symbol}>
                  <h4 className="font-semibold text-lg mb-2 border-b border-gray-700 pb-1">
                    {symbol}
                  </h4>
                  <div className="space-y-3">
                    {groupedNews[symbol].map((article) => (
                      <div
                        key={article.id}
                        className="border border-gray-700 rounded-lg p-4 bg-neutral-900 hover:bg-neutral-800 transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-neutral-800 bg-green-500 rounded-sm px-1">
                            {article.related}
                          </span>
                        </div>
                        <p className="font-medium text-gray-100 text-sm mb-1 leading-snug">
                          {article.headline}
                        </p>
                        <p className="text-gray-400 text-sm leading-snug">
                          {article.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

