
import * as z from 'zod';

export const RegisterFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'Nome deve ter pelo menos 2 caracteres',
  }),
  lastName: z.string().min(2, {
    message: 'Sobrenome deve ter pelo menos 2 caracteres',
  }),
  email: z.string().email({
    message: 'Digite um email válido',
  }),
  phone: z.string().min(10, {
    message: 'Telefone deve ter pelo menos 10 dígitos',
  }),
  companyName: z.string().min(2, {
    message: 'Nome da empresa deve ter pelo menos 2 caracteres',
  }),
  password: z.string().min(6, {
    message: 'Senha deve ter pelo menos 6 caracteres',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
