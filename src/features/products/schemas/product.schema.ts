import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  salePrice: z
    .number({
      required_error: "El precio de venta es obligatorio",
      invalid_type_error: "El precio de venta debe ser numérico",
    })
    .min(0, "El precio de venta no puede ser negativo")
    .multipleOf(0.01),
  stock: z
    .number({
      required_error: "El stock es obligatorio",
      invalid_type_error: "El stock debe ser numérico",
    })
    .int("El stock debe ser entero")
    .min(0, "El stock no puede ser negativo"),
  code: z.string().min(1, "El código es obligatorio"),
  costPrice: z
    .number({
      invalid_type_error: "El precio de costo debe ser numérico",
    })
    .min(0, "El precio de costo no puede ser negativo")
    .multipleOf(0.01)
    .optional(),
  barcode: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  imageUrls: z.array(z.string().url("Debe ser una URL válida")).optional(),
  productType: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre del tipo de producto es obligatorio"),
    code: z.string().min(1, "El código del tipo de producto es obligatorio"),
    notes: z.string().optional(),
  }),
  active: z.number().int("El estado debe ser entero").min(0).max(1).optional(),
});

export const PaginatedProductSchema = z.object({
  data: z.array(ProductSchema),
  total: z.number().min(0),
  page: z.number().min(1),
  limit: z.number().min(1),
  totalPages: z.number().min(1),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
export type PaginatedProduct = z.infer<typeof PaginatedProductSchema>;
