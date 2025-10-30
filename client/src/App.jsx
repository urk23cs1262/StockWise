import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import StockPage from "./pages/StocksPage";
import WatchList from "./pages/WatchList";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./auth/ProtectedRoute"; 
import ForgotPassword from "./pages/ForgetPassword";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <Router>
      <Routes>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stocks/:symbol" element={<StockPage />} />
            <Route path="/watchlist" element={<WatchList />} />
          </Route>
          <Route path="/admin" element={<AdminDashboard/>} />
        </Route>

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
