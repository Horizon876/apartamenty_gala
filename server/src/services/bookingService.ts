import { PrismaClient } from '@prisma/client';
import { CreateBookingInput } from '../schemas/bookingSchema';

const prisma = new PrismaClient();

export class BookingService {
  async createBooking(input: CreateBookingInput) {
    const { roomTypeId, checkIn, checkOut, ...rest } = input;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Wykorzystujemy transakcję, aby zapewnić atomowość sprawdzenia dostępności i zapisu
    return await prisma.$transaction(async (tx) => {
      // 1. Pobierz informacje o typie pokoju (ile ich jest w sumie)
      const roomType = await tx.roomType.findUnique({
        where: { id: roomTypeId },
      });

      if (!roomType) {
        throw new Error('Wybrany typ pokoju nie istnieje');
      }

      // 2. Policz istniejące rezerwacje nakładające się na ten termin
      // Warunek nakładania się dat: (start1 < end2) AND (end1 > start2)
      const overlappingBookingsCount = await tx.booking.count({
        where: {
          roomTypeId: roomTypeId,
          AND: [
            { checkIn: { lt: endDate } },
            { checkOut: { gt: startDate } },
          ],
        },
      });

      // 3. Sprawdź, czy są wolne pokoje
      if (overlappingBookingsCount >= roomType.totalRooms) {
        throw new Error('Brak dostępnych pokoi tego typu w wybranym terminie');
      }

      // 4. Stwórz rezerwację
      return await tx.booking.create({
        data: {
          ...rest,
          roomTypeId,
          checkIn: startDate,
          checkOut: endDate,
        },
      });
    });
  }

  async getRoomTypes() {
    return await prisma.roomType.findMany();
  }
}

export const bookingService = new BookingService();
