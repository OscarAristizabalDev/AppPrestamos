import { api } from "@/src/lib/api";
import {
  PaginatedProduct,
  PaginatedProductSchema,
} from "../schemas/product.schema";

export const getProductsPaginated = async ({
  pageParam = 1,
  inputSearch,
}: {
  pageParam?: number;
  inputSearch?: string;
}) => {
  const params = new URLSearchParams();
  params.append("page", String(pageParam));
  params.append("limit", "10");
  if (inputSearch) {
    params.append("search", inputSearch);
  }
  const { data } = await api.get<PaginatedProduct>(
    `products/all?${params.toString()}`,
  );
  try {
    const parsed = PaginatedProductSchema.parse(data);
    return parsed;
  } catch (error) {
    console.error("[Zod Parsing] Getting Clients Error: ", error);
    throw error;
  }
};
