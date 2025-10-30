import TradingViewWidget from "@/components/TradingViewWidget";
import { MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants";

const Home = () => {
    const scripUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";
    return (
        <div className="min-h-screen max-w-[90vw] m-auto">
            <section className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-8 py-8">
                <div className="md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title="Market Overview"
                        scritpUrl= {`${scripUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart"
                    />
                </div>
                <div className=" lg:col-span-2">
                    <TradingViewWidget
                        title="Stock Heatmap"
                        scritpUrl={`${scripUrl}stock-heatmap.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart"
                    />
                </div>
            </section>

            <section className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-8 py-8">
                <div className="md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        scritpUrl={`${scripUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        className="custom-chart"
                    />
                </div>
                <div className=" lg:col-span-2">
                    <TradingViewWidget
                        scritpUrl={`${scripUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        className="custom-chart"
                    />
                </div>
            </section>
        </div>
    );
}

export default Home;