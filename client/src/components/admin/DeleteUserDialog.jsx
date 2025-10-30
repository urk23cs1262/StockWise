import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import { useState } from "react";

const DeleteUserDialog = ({ open, onClose, user, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/admin/users/${user._id}`);
      setMessage("User deleted successfully!");
      refresh();
      setTimeout(() => {
        onClose();
        setLoading(false);
        setMessage("");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete user");
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p className="text-gray-400 mb-4">
          Are you sure you want to delete <strong>{user.username}</strong>?
        </p>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
        {message && <p className="text-center text-sm text-gray-400 mt-2">{message}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
