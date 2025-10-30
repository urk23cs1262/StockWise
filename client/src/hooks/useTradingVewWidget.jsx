import { useEffect, useRef } from "react";
const useTradingViewWidget = (scritpUrl, config, height = 500) => {
    const containerRef = useRef(null);
    useEffect(
        () => {
            if (!containerRef.current) return;
            if (containerRef.current.dataset.loaded) return;
            containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;" ></div>`
            const script = document.createElement("script");
            script.src = scritpUrl;
            script.async = true;
            script.innerHTML = JSON.stringify(config);
            containerRef.current.appendChild(script);
            containerRef.current.dataset.loaded = 'true';
            return () => {
                if(containerRef.current) {
                    containerRef.current.innerHTML = '';
                    delete containerRef.current.dataset.loaded;
                }
            }
        },
        [scritpUrl, config, height]
    );
    return containerRef;
}

export default useTradingViewWidget;