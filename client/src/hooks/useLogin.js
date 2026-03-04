import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { apiFetch } from "../utils/api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await credential.user.getIdToken();

      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error("Login failed");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["session"]);
    },
  });
};
