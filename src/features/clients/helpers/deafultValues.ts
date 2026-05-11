import { Client } from "../schemas/client.schema";

export const getDefaultClientValues = (): Client => ({
  id: "",
  names: "",
  surnames: "",
  fullName: undefined,
  email: "",
  phoneNumber: "",
  address: "",
  birthdate: "",
  typeDocument: {
    id: "",
    description: "",
  },
  documentNumber: "",
  employmentStatus: "",
  employerName: "",
  monthlyIncome: 100,
  creditScore: 100,
  riskCategory: "",
  notes: "",
});
