import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
const MainLayout = () => {
    return (
        <div className="h-screen">
            <Header/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}

export default MainLayout;