import { useParams, useLocation } from "react-router-dom";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { useEffect, useState } from "react";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

const StockPage = () => {
  const { symbol } = useParams();
    const location = useLocation();
      const company = location.state?.company || symbol.toUpperCase();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      const list = await getWatchlist();
      const exists = list.some((item) => item.symbol === symbol.toUpperCase());
      setIsInWatchlist(exists);
    };
    checkWatchlist();
  }, [symbol]);

  const handleWatchlistChange = (_, added) => {
    setIsInWatchlist(added);
  };

  const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

  if (!symbol) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400">
        No stock selected
      </div>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [symbol]);

  return (
    <div key={symbol} className="flex min-h-screen p-4 md:p-6 lg:p-8 text-gray-200">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col gap-6">
          <TradingViewWidget
            scritpUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />
          <TradingViewWidget
            scritpUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
          <TradingViewWidget
            scritpUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <WatchlistButton
              symbol={symbol.toUpperCase()}
              company={company}
              isInWatchlist={isInWatchlist}
              onWatchlistChange={handleWatchlistChange}
            />
          </div>

          <TradingViewWidget
            scritpUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />
          <TradingViewWidget
            scritpUrl={`${scriptUrl}symbol-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />
          <TradingViewWidget
            scritpUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
};

export default StockPage;
