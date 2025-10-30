import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WatchlistButton from "@/components/WatchlistButton";
import { Link } from "react-router-dom";
import { TrendingUp, Trash2 } from "lucide-react";
import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";


const WatchlistTable = ({ stocks, onRemove }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white/5 dark:bg-gray-800/50">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {WATCHLIST_TABLE_HEADER.map((header) => (
              <TableHead key={header} className="text-gray-400">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.symbol} className="hover:bg-gray-700/50 transition-colors">
              
              <TableCell className="font-medium">
                <Link to={`/stocks/${stock.symbol}`} state={{ company: stock.company }} className="flex items-center gap-2 hover:underline">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-white">{stock.company}</span>
                        <span className="text-xs text-gray-400">{stock.symbol}</span>
                    </div>
                </Link>
              </TableCell>
              
              <TableCell className="font-medium text-white">{stock.symbol}</TableCell>

              <TableCell className="text-white">{stock.priceFormatted}</TableCell>

              <TableCell 
                className={stock.changePercent > 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}
              >
                {stock.changeFormatted}
              </TableCell>

              <TableCell className="text-gray-300">{stock.marketCapFormatted}</TableCell>

              <TableCell className="text-gray-300">{stock.peRatio}</TableCell>

              <TableCell>
                <WatchlistButton 
                    symbol={stock.symbol} 
                    company={stock.company} 
                    isInWatchlist={true}
                    showTrashIcon={true} 
                    type="icon"
                    onWatchlistChange={() => onRemove(stock.symbol)}
                />
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WatchlistTable;