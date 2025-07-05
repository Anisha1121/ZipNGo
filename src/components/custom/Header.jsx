import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Header = () => {
  /** ------------------------------------------------------------------
   *  Local state
   * ------------------------------------------------------------------ */
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  /** ------------------------------------------------------------------
   *  Google OAuth flow
   * ------------------------------------------------------------------ */
  const login = useGoogleLogin({
    flow: "implicit", // or "auth-code" if you’re exchanging on the server
    onSuccess: async (tokenInfo) => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            params: { access_token: tokenInfo.access_token },
            headers: {
              Authorization: `Bearer ${tokenInfo.access_token}`,
              Accept: "application/json",
            },
          }
        );
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setOpenDialog(false);
      } catch (err) {
        console.error("Failed fetching Google profile:", err);
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => console.error("Google login error:", err),
  });

  /** ------------------------------------------------------------------
   *  Keep React state in‑sync if user logs in/out in another tab
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const syncUserAcrossTabs = (e) => {
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", syncUserAcrossTabs);
    return () => window.removeEventListener("storage", syncUserAcrossTabs);
  }, []);

  /** ------------------------------------------------------------------
   *  Logout helper
   * ------------------------------------------------------------------ */
  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null);
  };

  /** ------------------------------------------------------------------
   *  Render
   * ------------------------------------------------------------------ */
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-md px-2 py-1 flex justify-between items-center">
  <div className="flex items-center gap-1">
    <img src="/21.png" alt="ZipNGo Logo" className="h-18 w-18 object-contain" />
    <h1 className="text-xl font-bold text-gray-800">ZipNGo</h1>
  </div>

  {user ? (
    <div className="flex items-center gap-4">
  <a href="/my-trips">
    <Button
      className="px-6 py-2.5 rounded-full text-white font-semibold backdrop-blur-md bg-gradient-to-r from-indigo-500 via-blue-400 to-teal-400 shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out border border-white/30"
    >
       My Trips
    </Button>
  </a>
          <Popover>
            <PopoverTrigger asChild>
              <img
                src={user.picture}
                alt={user.name}
                className="h-[35px] w-[35px] rounded-full cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent className="w-32">
              <p
                className="cursor-pointer text-sm font-medium"
                onClick={handleLogout}
              >
                Logout
              </p>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Button onClick={() => setOpenDialog(true)} className="shadow">
          Sign In
        </Button>
      )}

      {/* ----------------------------------------------------------------
          Sign‑in modal
         ---------------------------------------------------------------- */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center">
                <img src="/logo.svg" alt="Logo" className="w-12 h-12 mb-4" />
                <h2 className="font-bold text-lg flex items-center gap-2">
                  Sign In with Google
                </h2>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Secure Google authentication for your account
                </p>

                <Button
                  disabled={loading}
                  onClick={login}
                  className="w-full mt-5 flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      <FcGoogle className="h-6 w-6" /> Sign In with Google
                    </>
                  )}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
