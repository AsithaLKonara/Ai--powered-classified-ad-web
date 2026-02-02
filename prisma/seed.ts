import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing ads to avoid duplicates on re-seed
  // Note: We don't delete categories/locations/users to preserve ID stability if referenced elsewhere, 
  // but for a clean seed usually one might want to. 
  // For now, let's just clean ads.
  await prisma.ad.deleteMany({})
  console.log('Deleted existing ads.')

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
      create: location as any,
    })
  }

  // Create sample users
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+94771234567',
      password: '$2a$12$h6..g8.KLmFb1WqDqy4zxuWhxMi8rzTCJy5724eRGCtKFsVyj/cPC', // password123
      emailVerified: new Date(),
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+94771234568',
      password: '$2a$12$h6..g8.KLmFb1WqDqy4zxuWhxMi8rzTCJy5724eRGCtKFsVyj/cPC', // password123
      emailVerified: new Date(),
    },
    {
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+94771234569',
      password: '$2a$12$h6..g8.KLmFb1WqDqy4zxuWhxMi8rzTCJy5724eRGCtKFsVyj/cPC', // password123
      emailVerified: new Date(),
      role: 'ADMIN',
    },
  ]

  const createdUsers = []
  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user as any,
    })
    createdUsers.push(createdUser)
  }

  // Get categories and locations for sample ads
  const vehicleCategory = await prisma.category.findUnique({ where: { slug: 'vehicles' } })
  const electronicsCategory = await prisma.category.findUnique({ where: { slug: 'electronics' } })
  const propertyCategory = await prisma.category.findUnique({ where: { slug: 'property' } })
  const fashionCategory = await prisma.category.findUnique({ where: { slug: 'fashion-beauty' } })
  const homeCategory = await prisma.category.findUnique({ where: { slug: 'home-garden' } })
  const photographyCategory = await prisma.category.findUnique({ where: { slug: 'photography' } })

  const colomboLocation = await prisma.location.findUnique({ where: { slug: 'colombo' } })
  const kandyLocation = await prisma.location.findUnique({ where: { slug: 'kandy' } })
  const galleLocation = await prisma.location.findUnique({ where: { slug: 'galle' } })
  const negomboLocation = await prisma.location.findUnique({ where: { slug: 'negombo' } })

  // Create sample ads
  const sampleAds = [
    // Electronics
    {
      title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
      description: 'Excellent condition iPhone 15 Pro Max with 256GB storage. Used for 3 months. Battery health 99%. Comes with full kit and Apple Care+.',
      price: 385000,
      categoryId: electronicsCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[0].id,
      images: [
        'https://images.unsplash.com/photo-1696446702183-f8a5d373b6bc?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop',
      ],
      isBoosted: true,
    },
    {
      title: 'MacBook Pro M3 Max 16-inch',
      description: 'Brand new sealed MacBook Pro M3 Max. 36GB Unified Memory, 1TB SSD. Space Black. One year international warranty.',
      price: 950000,
      categoryId: electronicsCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'NEW',
      type: 'SALE',
      userId: createdUsers[2].id,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop',
      ],
      isBoosted: true,
    },
    {
      title: 'Sony A7IV Mirrorless Camera Body',
      description: 'Mint condition Sony A7IV. Shutter count less than 5000. Includes original battery, strap, and box. Perfect for hybrid shooters.',
      price: 650000,
      categoryId: photographyCategory?.id || '',
      locationId: kandyLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[1].id,
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1624823183488-2d8883656c07?w=800&auto=format&fit=crop',
      ],
    },
    // Vehicles
    {
      title: 'Toyota Land Cruiser Prado 2020',
      description: 'Toyota Land Cruiser Prado TX-L Package. Pearl White. Beige Interior. Sunroof, 7 Seater, Electric Seats. First Owner. Company Maintained.',
      price: 45000000,
      categoryId: vehicleCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[0].id,
      images: [
        'https://images.unsplash.com/photo-1594502184342-2cf5463ee9a3?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?w=800&auto=format&fit=crop',
      ],
      isBoosted: true,
    },
    {
      title: 'Honda Vezel RS Sensing 2018',
      description: 'Honda Vezel RS Sensing. Wine Red. Black Interior. Paddle Shift, Cruise Control, Lane Keep Assist. CAZ-xxxx number. 45000km done.',
      price: 9800000,
      categoryId: vehicleCategory?.id || '',
      locationId: negomboLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[1].id,
      images: [
        'https://images.unsplash.com/photo-1628864700812-32a2257d0d04?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590362835650-0c410363fa3c?w=800&auto=format&fit=crop',
      ],
    },
    // Property
    {
      title: 'Luxury Apartment for Rent in Colombo 03',
      description: 'Fully furnished 3 bedroom luxury apartment at The Monarch. Sea view, swimming pool, gym, 24/7 security. Designated parking slot.',
      price: 450000,
      categoryId: propertyCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'USED',
      type: 'RENT',
      userId: createdUsers[2].id,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      ],
      isBoosted: true,
    },
    {
      title: 'Two Story House for Sale in Galle',
      description: 'Beautiful 4 bedroom house with garden in Galle Fort area. 15 perches land. Colonial style architecture. Clear deeds.',
      price: 85000000,
      categoryId: propertyCategory?.id || '',
      locationId: galleLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[0].id,
      images: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
      ],
    },
    // Fashion
    {
      title: 'Rolex Submariner Date - 2023',
      description: 'Rolex Submariner Date 126610LN. Unworn condition. Full set with box and papers. 5 years international warranty remaining.',
      price: 4200000,
      categoryId: fashionCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'NEW',
      type: 'SALE',
      userId: createdUsers[2].id,
      images: [
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&auto=format&fit=crop',
      ],
    },
    {
      title: 'Louis Vuitton Neverfull MM Tote',
      description: 'Authentic Louis Vuitton Neverfull MM in Damier Ebene canvas. Good condition. Comes with dust bag and receipt.',
      price: 450000,
      categoryId: fashionCategory?.id || '',
      locationId: colomboLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[1].id,
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590874103328-360702cae060?w=800&auto=format&fit=crop',
      ],
    },
    // Home & Garden
    {
      title: 'Modern L-Shaped Sofa Set',
      description: 'Grey fabric L-shaped sofa. High density foam. Teak wood frame. Very comfortable and stylish. 3 months used.',
      price: 125000,
      categoryId: homeCategory?.id || '',
      locationId: kandyLocation?.id || '',
      condition: 'USED',
      type: 'SALE',
      userId: createdUsers[0].id,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&auto=format&fit=crop',
      ],
    },
  ]

  for (const adData of sampleAds) {
    const { images, ...adFields } = adData
    const ad = await prisma.ad.create({
      data: {
        ...adFields,
        // Ensure status is ACTIVE for these seed ads
        status: 'ACTIVE' as any,
        images: {
          create: images.map((url, index) => ({
            url,
            order: index,
          }))
        }
      } as any
    })
    console.log(`Created ad: ${ad.title}`)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', JSON.stringify(e, null, 2))
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })