import * as z from "zod";

export const ClientSchema = z.object({
  id: z.string().optional(),
  names: z.string().min(2).max(100),
  surnames: z.string().min(2).max(100),
  fullName: z.string().min(2).max(100).optional(),
  //registrationDate: z.date(),
  email: z.string().email().min(5).max(100),
  phoneNumber: z.string().min(10).max(20),
  address: z.string().min(5).max(200),
  birthdate: z.string().min(1, "La fecha es requerida"),
  typeDocument: z.object({
    id: z.string().min(1),
    description: z.string().min(1),
  }),
  documentNumber: z.string().min(7).max(20),
  employmentStatus: z.string().min(5).max(30),
  employerName: z.string().min(5).max(100),
  monthlyIncome: z.number().min(100),
  creditScore: z.number().min(100),
  riskCategory: z.string().min(2).max(100),
  notes: z.string().min(2).max(200),
  //active: z.string().min(5).max(10),
  //createdAt: z.date(),
  //updatedAt: z.date().nullable(),
});

export const UpdateClientSchema = z.object({
  id: z.string().optional(),
  names: z.string().min(2).optional(),
  surnames: z.string().min(2).optional(),
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  birthdate: z.string().min(1).optional(),
  typeDocument: z
    .object({
      id: z.string().min(1),
      description: z.string().min(1),
    })
    .optional(), // ← mantiene el objeto completo
  documentNumber: z.string().min(7).optional(),
  employmentStatus: z.string().min(5).optional(),
  employerName: z.string().min(5).optional(),
  monthlyIncome: z.number().min(100).optional(),
  creditScore: z.number().min(100).optional(),
  riskCategory: z.string().min(2).optional(),
  notes: z.string().min(2).optional(),
});

export const DeleteClientSchema = ClientSchema.pick({ id: true });

export const PaginatedClientSchema = z.object({
  data: z.array(ClientSchema),
  total: z.number().min(0),
  page: z.number().min(1),
  limit: z.number().min(1),
  totalPages: z.number().min(1),
});

export type Client = z.infer<typeof ClientSchema>;
export type UpdateClient = z.infer<typeof UpdateClientSchema>;
export type DeleteClient = z.infer<typeof DeleteClientSchema>;
export type PaginatedClient = z.infer<typeof PaginatedClientSchema>;
