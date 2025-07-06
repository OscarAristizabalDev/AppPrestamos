
import { z } from 'zod';

export const loanSchema = z.object({
    amount: z.number().min(1000, 'El valor mínimo del prestamo es de 1.000'),
    frequency: z.number(),
    numberQuotes: z.number().min(1, 'El valor mínimo es de una cuota'),
    interestRate: z.number().min(1, 'El porcentaje de intereses debe ser al menor 1 %').max(100, 'El porcentaje de intereses no debe ser superior al 100 %'),
});

export type LoanFormData = z.infer<typeof loanSchema>;
