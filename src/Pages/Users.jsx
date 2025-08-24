import { useEffect, useState } from "react";
import api from "../api";
import UserTable from "../Component/UserTable"; // ✅ make sure this exists
// import useAuth from "../context/AuthContext"; // if you have an auth context

export default function Users() {
  // If you have an auth context:
  // const { user } = useAuth();

  // Or get user from localStorage:
  const user = {
    role: localStorage.getItem("role"),
    name: localStorage.getItem("loggedInUser"),
  };

  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/dashboard/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // If API returns { success, users }
        setRows(data.users || []);
      } catch (e) {
        setErr(e.response?.data?.message || "Error fetching users");
      }
    };

    if (user?.role === "admin") fetchUsers();
  }, [user]);

  if (user?.role !== "admin")
    return <div className="card">Only admins can view users.</div>;

  return (
    <>
      {err && <div className="card error">{err}</div>}
      <UserTable rows={rows} />
    </>
  );
}
