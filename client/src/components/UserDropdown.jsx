import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserRoundX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import NavItems from "./NavItems";
import useSignOut from "@/hooks/useSignOut";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { handleSignOut } = useSignOut();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    navigate("/auth"); 
  };

  const confirmSignOut = () => {
    setOpen(false);
    handleSignOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-3 text-gray-400 hover:text-yellow-500"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                {user.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-center">
              <span className="text-base font-medium text-gray-400">
                {user.username || "User"}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-400">
                  {user.username || "User"}
                </span>
                <span className="text-sm text-gray-400">{user.email || "user@example.com"}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center text-gray-100"
          >
            <LogOut className="h-4 w-4 sm:block" />
            Logout
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="flex items-center text-gray-100"
          >
            <UserRoundX className="h-4 w-4 sm:block" />
            Delete Account
          </DropdownMenuItem>
          <nav className="sm:hidden">
            <NavItems />
          </nav>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and watchlist. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSignOut}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserDropdown;
