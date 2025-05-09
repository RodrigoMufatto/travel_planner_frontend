import { useMutation } from "@tanstack/react-query";
import { authService } from "../service/auth-services";

export function useRegister() {
    return useMutation({
      mutationKey: ["register"],
      mutationFn: authService.register,
    });
  }