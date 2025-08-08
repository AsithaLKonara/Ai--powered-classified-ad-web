import { PrismaClient } from '@prisma/client'

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

  // Get categories and locations for sample ads
  const vehicleCategory = await prisma.category.findUnique({ where: { slug: 'vehicles' } })
  const electronicsCategory = await prisma.category.findUnique({ where: { slug: 'electronics' } })
  const propertyCategory = await prisma.category.findUnique({ where: { slug: 'property' } })
  const colomboLocation = await prisma.location.findUnique({ where: { slug: 'colombo' } })
  const kandyLocation = await prisma.location.findUnique({ where: { slug: 'kandy' } })

  // Create sample ads
  const sampleAds = [
    {
      title: 'iPhone 15 Pro Max 256GB - Like New',
      description: 'Excellent condition iPhone 15 Pro Max with 256GB storage. No scratches, comes with original box and accessories.',
      price: 450000,
      categoryId: electronicsCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[0].id,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      ],
    },
    {
      title: 'Toyota Prius 2020 - Hybrid',
      description: 'Well-maintained Toyota Prius hybrid with excellent fuel efficiency. Full service history available.',
      price: 8500000,
      categoryId: vehicleCategory?.id || '',
      locationId: kandyLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[1].id,
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      ],
    },
    {
      title: 'MacBook Pro M3 14-inch',
      description: 'Brand new MacBook Pro with M3 chip, 14-inch display, 512GB SSD. Perfect for work and creative tasks.',
      price: 650000,
      categoryId: electronicsCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'NEW',
      type: 'SALE',
      userId: createdUsers[2].id,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      ],
    },
    {
      title: 'Apartment for Rent - Colombo 03',
      description: 'Modern 2-bedroom apartment in Colombo 03. Fully furnished, 24/7 security, parking available.',
      price: 75000,
      categoryId: propertyCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'NEW',
      type: 'RENT',
      userId: createdUsers[0].id,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
    },
  ]

  for (const adData of sampleAds) {
    const { images, ...adFields } = adData
    const ad = await prisma.ad.create({
      data: {
        ...adFields,
        images: {
          create: images.map((url, index) => ({
            url,
            order: index,
          }))
        }
      }
    })
    console.log(`Created ad: ${ad.title}`)
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