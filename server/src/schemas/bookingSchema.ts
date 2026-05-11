import { z } from 'zod';

export const CreateBookingSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  email: z.string().email('Niepoprawny format adresu email'),
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), 'Niepoprawna data przyjazdu'),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), 'Niepoprawna data wyjazdu'),
  guests: z.number().int().positive('Liczba osób musi być dodatnia'),
  roomTypeId: z.string().uuid('Niepoprawny identyfikator typu pokoju'),
}).refine((data) => {
  const start = new Date(data.checkIn);
  const end = new Date(data.checkOut);
  return end > start;
}, {
  message: 'Data wyjazdu musi być późniejsza niż data przyjazdu',
  path: ['checkOut'],
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
