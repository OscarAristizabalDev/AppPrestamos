import { api } from "../lib/api";
import { AuthRequest, AuthResponse } from "../schemas/auth.schema";

const login = async ({
  email,
  password,
}: AuthRequest): Promise<AuthResponse> => {
  console.log("api data: ", { email, password });
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export default login;
