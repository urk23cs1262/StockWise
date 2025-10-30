import { Link } from "react-router-dom";
import { NAV_ITEMS } from "@/lib/constants";
import SearchCommand from "./SearchCommand";
const NavItems = ({ initialStocks = [] }) => {
    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10">
            {NAV_ITEMS.map((item, index) => {
                if(item.title === "Search") return(
                    <li key="search-trigger">
                        <SearchCommand
                            renderAs="text"
                            label="Seach"
                            initialStocks={initialStocks}
                        />
                    </li>
                )
                return (<li key={index}>
                    <Link to={item.to} className="hover:text-yellow-500 transition-colors" >
                        {item.title}
                    </Link>
                </li>)
            })}
        </ul>
    );
}

export default NavItems;