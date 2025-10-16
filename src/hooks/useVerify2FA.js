import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useVerify2FA() {
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/api/verify-2fa", data);
      return res.data;
    },
  });
}
