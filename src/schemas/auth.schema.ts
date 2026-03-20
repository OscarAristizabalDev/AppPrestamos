import { z } from "zod";

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const AuthRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(100),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type AuthRequest = z.infer<typeof AuthRequestSchema>;
