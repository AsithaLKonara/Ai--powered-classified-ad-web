const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const categories = [
    { name: 'Vehicles', slug: 'vehicles', description: 'Cars, motorcycles, and other vehicles' },
    { name: 'Electronics', slug: 'electronics', description: 'Phones, laptops, and gadgets' },
    { name: 'Property', slug: 'property', description: 'Houses, apartments, and land' },
    { name: 'Jobs', slug: 'jobs', description: 'Employment opportunities' },
    { name: 'Services', slug: 'services', description: 'Professional and personal services' },
    { name: 'Fashion & Beauty', slug: 'fashion-beauty', description: 'Clothing and cosmetics' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Furniture and home improvement' },
    { name: 'Sports & Hobbies', slug: 'sports-hobbies', description: 'Sports equipment and hobbies' },
    { name: 'Education', slug: 'education', description: 'Books, courses, and tutoring' },
    { name: 'Music & Media', slug: 'music-media', description: 'Musical instruments and media' },
    { name: 'Photography', slug: 'photography', description: 'Cameras and photography equipment' },
    { name: 'Health & Beauty', slug: 'health-beauty', description: 'Health and beauty products' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create locations
  const locations = [
    { name: 'Colombo', slug: 'colombo', type: 'CITY' },
    { name: 'Kandy', slug: 'kandy', type: 'CITY' },
    { name: 'Galle', slug: 'galle', type: 'CITY' },
    { name: 'Jaffna', slug: 'jaffna', type: 'CITY' },
    { name: 'Negombo', slug: 'negombo', type: 'CITY' },
    { name: 'Matara', slug: 'matara', type: 'CITY' },
    { name: 'Kurunegala', slug: 'kurunegala', type: 'CITY' },
    { name: 'Anuradhapura', slug: 'anuradhapura', type: 'CITY' },
    { name: 'Polonnaruwa', slug: 'polonnaruwa', type: 'CITY' },
    { name: 'Ratnapura', slug: 'ratnapura', type: 'CITY' },
  ]

  for (const location of locations) {
    await prisma.location.upsert({
      where: { slug: location.slug },
      update: {},
      create: location,
    })
  }

  // Create sample users
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+94771234567',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ3qKre', // password123
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+94771234568',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ3qKre', // password123
    },
    {
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+94771234569',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ3qKre', // password123
    },
  ]

  const createdUsers = []
  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
    createdUsers.push(createdUser)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 