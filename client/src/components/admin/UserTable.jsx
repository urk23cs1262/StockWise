import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, UserCircle2 } from "lucide-react";
import UpdateUserDialog from "./UpdateUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import { Badge } from "@/components/ui/badge";

const UserTable = ({ users = [], refresh }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-lg overflow-hidden mt-8">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-blue-400" />
          User Management
        </h2>
        <p className="text-sm text-neutral-400">
          Total: <span className="font-medium text-white">{users.length}</span>
        </p>
      </div>

      {/* Fixed height table with scrollable body */}
      <div className="overflow-x-auto">
        <div className="max-h-75 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-hide-default">
          <Table>
            <TableHeader className="sticky top-0 bg-neutral-900 z-10">
              <TableRow className="border-neutral-800">
                <TableHead className="text-neutral-400 font-medium">Name</TableHead>
                <TableHead className="text-neutral-400 font-medium">Email</TableHead>
                <TableHead className="text-neutral-400 font-medium">Role</TableHead>
                <TableHead className="text-neutral-400 font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="border-neutral-800 hover:bg-neutral-800/70 transition-colors"
                  >
                    <TableCell className="font-medium text-white">
                      {user.username || "—"}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {user.email || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.role === "admin"
                            ? "border-yellow-500 text-yellow-400"
                            : "border-blue-500 text-blue-400"
                        }`}
                      >
                        {user.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-700 hover:border-blue-500 hover:text-blue-400"
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenEdit(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-700 hover:border-red-500 hover:text-red-400"
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-neutral-400"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <UpdateUserDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
        refresh={refresh}
      />
      <DeleteUserDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        user={selectedUser}
        refresh={refresh}
      />
    </div>
  );
};

export default UserTable;
