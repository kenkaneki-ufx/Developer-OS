import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Add your seed logic here
  // Example:
  // await prisma.user.create({
  //   data: {
  //     name: "Test User",
  //     email: "test@example.com",
  //   },
  // });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
