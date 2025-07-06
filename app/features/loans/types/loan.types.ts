
import { z } from 'zod';
import { loanSchema } from '../schemas/loan.schema';

export type LoanFormData = z.infer<typeof loanSchema>;
