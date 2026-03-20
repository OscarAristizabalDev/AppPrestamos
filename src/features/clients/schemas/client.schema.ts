import * as z from "zod";

export const ClientSchema = z.object({
  id: z.string(),
  names: z.string().min(2).max(100),
  surnames: z.string().min(2).max(100),
  fullName: z.string().min(2).max(100),
  //registrationDate: z.date(),
  email: z.string().email().min(5).max(100),
  phoneNumber: z.string().min(10).max(20),
  address: z.string().min(5).max(200),
  birthdate: z.string().transform((val) => new Date(val)),
  typeDocument: z.string().min(4).max(15),
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

export const PaginatedClientSchema = z.object({
  data: z.array(ClientSchema),
  total: z.number().min(0),
  page: z.number().min(1),
  limit: z.number().min(1),
  totalPages: z.number().min(1),
});

export type Client = z.infer<typeof ClientSchema>;
export type PaginatedClient = z.infer<typeof PaginatedClientSchema>;
