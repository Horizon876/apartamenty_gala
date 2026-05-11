import { z } from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const CreateBookingSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki').max(50, 'Zbyt długie imię'),
  lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki').max(50, 'Zbyt długie nazwisko'),
  email: z.string().email('Niepoprawny format adresu email').max(100, 'Zbyt długi email'),
  checkIn: z.coerce.date().refine(val => val >= today, 'Nie można rezerwować w przeszłości'),
  checkOut: z.coerce.date(),
  guests: z.coerce.number().int().positive('Liczba osób musi być dodatnia').max(20, 'Zbyt duża liczba osób'),
  roomTypeId: z.string().uuid('Niepoprawny identyfikator typu pokoju'),
}).refine((data) => {
  return data.checkOut > data.checkIn;
}, {
  message: 'Data wyjazdu musi być późniejsza niż data przyjazdu',
  path: ['checkOut'],
}).refine((data) => {
  const diffTime = Math.abs(data.checkOut.getTime() - data.checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays <= 30;
}, {
  message: 'Maksymalny czas pobytu to 30 dni',
  path: ['checkOut']
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
