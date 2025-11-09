const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const existingBrand = await prisma.brand.findUnique({
      where: { id: 'test1' },
    });

    if (!existingBrand) {
      // Check if a user exists, or create a dummy one if necessary
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: 'dummy-user-id', // A dummy ID for testing
            name: 'Dummy User',
            email: 'dummy@example.com',
          },
        });
        console.log('Dummy user created for seeding.');
      }

      await prisma.brand.create({
        data: {
          id: 'test1',
          name: 'Test Brand',
          description: 'AI-powered branding demo',
          userId: user.id, // Use the ID of an existing or newly created user
        },
      });
      console.log('Test brand seeded successfully!');
    } else {
      console.log('Test brand already exists, skipping seeding.');
    }
  } catch (e) {
    console.error('Error seeding test brand:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();