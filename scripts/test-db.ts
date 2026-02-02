import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
    try {
        console.log('Testing connection...')
        const userCount = await prisma.user.count()
        console.log('User count:', userCount)
        const adCount = await prisma.ad.count()
        console.log('Ad count:', adCount)
        console.log('Connection successful!')
    } catch (error) {
        console.error('Connection failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

test()
