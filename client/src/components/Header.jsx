// src/components/Header.jsx
import { Link } from "react-router-dom";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useState, useEffect } from "react";

const Header = ({ showNav = true }) => {
  const [initialStocks, setInitialStocks] = useState([]);

  useEffect(() => {
    if (!showNav) return; // ✅ Skip loading stocks for admin
    const loadInitialStocks = async () => {
      try {
        const stocks = await searchStocks(""); // e.g. popular stocks
        setInitialStocks(stocks);
      } catch (err) {
        console.error("Failed to load initial stocks:", err);
        setInitialStocks([]);
      }
    };
    loadInitialStocks();
  }, [showNav]);

  return (
    <header className="sticky top-0 z-100 bg-neutral-900 p-2 border-b border-neutral-800">
      <div className="max-w-[85vw] m-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex gap-3 items-center text-2xl font-semibold text-gray-300"
        >
          <img
            src="./stockwise.png"
            alt="StockWise logo"
            height={32}
            width={140}
            className="h-14 w-auto cursor-pointer bg-black rounded-full flex-center p-1"
          />
          StockWise
        </Link>

        {showNav && (
          <nav className="hidden sm:flex items-center gap-15">
            <NavItems initialStocks={initialStocks} />
          </nav>
        )}

        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
