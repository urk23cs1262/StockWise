import { useState } from "react";
import SignIn from "@/auth/signin/SignIn";
import SignUp from "@/auth/signup/SignUp";
import { Navigate } from "react-router-dom";


const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true); // default: Sign In

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;

      if (payload.exp > now) {
        return <Navigate to="/" replace />;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      <section
        className={`w-full lg:w-[40%] ${isSignIn ? "lg:py-30" : "lg:py-5"
          } bg-neutral-950 p-6 lg:px-16 overflow-y-auto scrollbar-hide-default lg:h-screen`}
      >
        <div className="flex flex-col items-center gap-3">
          <img
            src="./stockwise.png"
            alt="logo"
            className="h-[60px] w-auto rounded-md"
          />
          <h2 className="mb-9 text-center">StockWise</h2>
        </div>

        {isSignIn ? (
          <SignIn onSwitch={() => setIsSignIn(false)} />
        ) : (
          <SignUp onSwitch={() => setIsSignIn(true)} />
        )}
      </section>

      <section className="flex-1 bg-neutral-900 p-6 relative overflow-hidden">
        <div className="absolute mt-10 ml-10">
          <p >
            Track, analyze, and stay ahead of the market — all in real time with <span className="text-yellow-500 text-2xl font-semibold">StockWise</span>.
          </p>
          <p>
            Your personalized hub for stocks, trends, and insights.
          </p>
        </div>

        <div className="relative top-1/5 left-1/10 ">
          <img src="./LoginImage.png" alt="StockWise image"
            className="border-6 border-gray-800 rounded-2xl" />
        </div>
      </section>
    </main>

  );
}

export default AuthPage;