import { useEffect, useState } from "react";
import api from "../api/api@instance/ap-v1i";
import type { CommonUser } from "@/api/UserApi";

export default function useAuth() {
  const [user, setUser] = useState<CommonUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/user/find/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
  };
}
