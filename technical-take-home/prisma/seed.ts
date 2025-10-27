import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createMock() {
  // Clear previous mock data
  await prisma.application.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.user.deleteMany();

  // Create mock users
  const alice = await prisma.user.create({
    data: { name: "Alice", email: "alice@example.com" },
  });

  // Create mock shifts
  const shift = await prisma.shift.create({
    data: {
      title: "Day Nurse",
      facilityName: "Austin General Hospital",
      location: "Austin, TX",
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000), 
      hourlyRateCents: 4000,
    },
  });

  // Create mock application
  await prisma.application.create({
    data: {
      userId: alice.id,
      shiftId: shift.id,
    },
  });

  console.log("Simple seed completed! Users, Shifts, Applications created.");
}

// Run the seed
async function runSeed() {
  try {
    await createMock();
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();