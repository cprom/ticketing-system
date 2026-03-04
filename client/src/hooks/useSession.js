import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/api";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await apiFetch("/auth/me");

      if (!res.ok) throw new Error("Not authenticated");

      return res.json();
    },
  });
};
