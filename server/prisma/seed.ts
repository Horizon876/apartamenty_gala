import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  // Clear all data to allow a fresh start
  await prisma.booking.deleteMany()
  await prisma.roomType.deleteMany()
  
  const roomTypes = [
    {
      name: 'Pokój Jednoosobowy',
      capacity: 1,
      totalRooms: 5,
      description: 'Komfortowa przestrzeń dla podróżujących solo. Zapewnia spokój i wszystkie niezbędne udogodnienia do pracy i odpoczynku.',
      basePrice: 180,
      images: JSON.stringify(['/images/rooms/single.webp'])
    },
    {
      name: 'Pokój Dwuosobowy Standard',
      capacity: 2,
      totalRooms: 12,
      description: 'Klasyczny wybór dla par. Eleganckie wykończenie i przytulna atmosfera gwarantująca relaks.',
      basePrice: 280,
      images: JSON.stringify(['/images/rooms/double_standard.webp'])
    },
    {
      name: 'Pokój Trzyosobowy',
      capacity: 3,
      totalRooms: 6,
      description: 'Przestronne wnętrze idealne dla rodzin lub grup znajomych. Połączenie funkcjonalności z luksusowym stylem.',
      basePrice: 380,
      images: JSON.stringify(['/images/rooms/triple.webp'])
    },
    {
      name: 'Pokój Czteroosobowy',
      capacity: 4,
      totalRooms: 3,
      description: 'Nasze największe pokoje, zapewniające swobodę i wygodę dla większych grup lub rodzin.',
      basePrice: 480,
      images: JSON.stringify(['/images/rooms/quadruple.webp'])
    },
    {
      name: 'Studio Trzyosobowe',
      capacity: 3,
      totalRooms: 2,
      description: 'Wyjątkowy układ pomieszczeń zapewniający dodatkową prywatność i przestrzeń. Idealne na dłuższe pobyty.',
      basePrice: 550,
      images: JSON.stringify(['/images/rooms/studio_triple.webp'])
    },
  ]

  for (const rt of roomTypes) {
    await prisma.roomType.upsert({
      where: { name: rt.name },
      update: {},
      create: rt,
    })
  }

  // Create reception user
  const hashedPassword = await bcrypt.hash('recepcja123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@gala.pl' },
    update: {},
    create: {
      email: 'admin@gala.pl',
      password: hashedPassword,
      name: 'Recepcja Gala',
      role: 'RECEPTIONIST'
    }
  })

  console.log('Seed data created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
