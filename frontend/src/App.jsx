import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios";
import { Plus, X, Users } from "lucide-react";
import { toast } from "react-toastify";

const getUsers = async () => {
  const resp = await axios.get("http://localhost:8080");

  return resp.data;
}

const addNewUser = async (newUserData) => {
  const resp = await axios.post("http://localhost:8080", newUserData)

  return resp.data;
}

const UserManager = () => {
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const queryClient = useQueryClient()

  const { data, isError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  })

  const userMutation = useMutation({
    mutationFn: addNewUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("New User Added!");
    },
    onError: () => {
      toast.error("Failed to create new user!");
    }
  })

  const addUser = () => {
    if (nameValue.trim() && emailValue.trim()) {
      const newName = nameValue.trim()
      const newEmail = emailValue.trim()

      userMutation.mutate({
        name: newName,
        email: newEmail,
      })
      setNameValue("");
      setEmailValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addUser();
    }
  };
  
  if(isLoading){
    return (
      <div>Loading Data...</div>
    )
  }
  
  if(isError){
    return (
      <div>Failed to load users...</div>
    )
  }

  const totalCount = data.users.length;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--gradient-primary)] px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">User Manager</h1>
          <p className="text-primary-foreground/80 text-sm">
            {totalCount > 0 ? `${totalCount} users registered` : "No users yet"}
          </p>
        </div>

        {/* Add User */}
        <div className="p-6 border-b border-border bg-card">
          <div className="space-y-3">
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter name..."
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       transition-[var(--transition-smooth)] text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex gap-3">
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter email..."
                className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-[var(--transition-smooth)] text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={addUser}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl 
                         hover:opacity-90 transition-[var(--transition-smooth)]
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                         flex items-center justify-center shadow-[var(--shadow-soft)]"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto">
          {data.users.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto mb-3 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">Your users will appear here</p>
            </div>
          ) : (
            <div className="p-3">
              {data.users.map((user) => (
                <div
                  key={user.id}
                  className="group flex items-center gap-3 p-4 mx-3 mb-2 rounded-xl 
                           transition-[var(--transition-smooth)] hover:bg-todo-item-hover
                           bg-todo-item-bg border border-border/50 hover:border-border"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground mt-1">Added: {user.createdAt}</div>
                  </div>

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground 
                             hover:text-destructive transition-[var(--transition-smooth)]
                             rounded-md hover:bg-destructive/10"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManager;
