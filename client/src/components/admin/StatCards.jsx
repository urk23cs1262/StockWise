import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, TrendingUp } from "lucide-react";

const StatCards = ({ stats }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {/* 🧍 Total Users */}
      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 shadow-lg hover:shadow-neutral-700/50 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Total Users
          </CardTitle>
          <Users className="h-5 w-5 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white">
            {stats?.totalUsers ?? 0}
          </div>
          <p className="text-xs text-neutral-400 mt-1">Registered accounts</p>
        </CardContent>
      </Card>

      {/* 📊 Total Watchlisted Stocks */}
      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 shadow-lg hover:shadow-neutral-700/50 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Total Watchlisted Stocks
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white">
            {stats?.totalWatchlistedStocks ?? 0}
          </div>
          <p className="text-xs text-neutral-400 mt-1">Across all users</p>
        </CardContent>
      </Card>

      {/* 🏆 Top 3 Watchlisted Stocks */}
      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 shadow-lg hover:shadow-neutral-700/50 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-neutral-300">
            Top 3 Watchlisted Stocks
          </CardTitle>
          <Star className="h-5 w-5 text-yellow-400" />
        </CardHeader>
        <CardContent>
          {stats?.topStocks?.length > 0 ? (
            <ul className="space-y-2 text-sm mt-2">
              {stats.topStocks.map((stock, i) => (
                <li
                  key={stock._id || i}
                  className="flex justify-between border-b border-neutral-700/50 pb-1"
                >
                  <span className="font-semibold text-white">
                    {i + 1}. {stock._id}
                  </span>
                  <span className="text-neutral-400">{stock.count} users</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm mt-2">No data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
