import React from 'react';

const NewsList = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-gray-700 bg-gray-900/50 h-full flex items-center justify-center">
        <p className="text-gray-400">No recent news available for your watchlist stocks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
      {news.slice(0, 10).map((article) => ( 
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors shadow-md"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2">
              {article.headline}
            </h4>
            {article.image && (
              <img
                src={article.image}
                alt="News thumbnail"
                className="w-16 h-12 object-cover rounded ml-3 flex-shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            )}
          </div>
          <div className="text-xs text-gray-500">
            {article.source}
            {article.relatedSymbol && (
              <span className="ml-2 px-2 py-0.5 bg-green-900/50 text-green-300 rounded-full font-medium">
                {article.relatedSymbol}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default NewsList;