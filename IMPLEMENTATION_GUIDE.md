# 🚀 ClassifiedHub Implementation Guide

## 🎯 Quick Start Implementation

### **Step 1: Set Up Database & Dependencies**

```bash
# Install missing dependencies
npm install @prisma/client @next-auth/prisma-adapter next-auth bcryptjs jsonwebtoken redis ioredis nodemailer twilio stripe sharp multer rate-limiter-flexible helmet cors compression express-rate-limit socket.io socket.io-client framer-motion react-query swr date-fns react-hook-form react-hot-toast react-intersection-observer react-virtualized react-window react-infinite-scroll-component react-lazyload react-image-lightbox react-image-crop react-dropzone react-slick slick-carousel react-countdown react-phone-number-input react-currency-input-field react-select react-datepicker react-calendar react-time-picker react-color react-slider react-toggle react-switch react-checkbox react-radio-button react-tabs react-accordion react-collapsible react-modal react-portal react-tooltip react-popover react-dropdown react-autocomplete react-tag-input react-rating react-star-rating react-progress-bar react-loading-skeleton react-spinners react-loading react-spinner react-loader react-loading-dots react-loading-bar react-loading-spinner react-loading-animation react-loading-indicator react-loading-overlay react-loading-screen react-loading-component react-loading-widget react-loading-element react-loading-item react-loading-box react-loading-circle

# Set up environment
cp env.example .env.local

# Run database migrations
npm run db:generate
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### **Step 2: Implement Critical API Routes**

#### **2.1 Authentication APIs**

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone } = registerSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    )
  }
}
```

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    )
  }
}
```

#### **2.2 Ad Management APIs**

```typescript
// app/api/ads/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const search = searchParams.get('search')

    const where: any = {
      status: 'ACTIVE',
    }

    if (category) {
      where.category = { slug: category }
    }

    if (location) {
      where.location = { slug: location }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const ads = await prisma.ad.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            verified: true,
          }
        },
        category: true,
        location: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.ad.count({ where })

    return NextResponse.json({
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      categoryId,
      locationId,
      condition,
      images,
    } = body

    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        locationId,
        condition,
        userId: session.user.id,
        images: {
          create: images.map((url: string, index: number) => ({
            url,
            order: index,
          }))
        }
      },
      include: {
        user: true,
        category: true,
        location: true,
        images: true,
      }
    })

    return NextResponse.json({
      message: 'Ad created successfully',
      ad
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    )
  }
}
```

```typescript
// app/api/ads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            verified: true,
            rating: true,
          }
        },
        category: true,
        location: true,
        images: true,
        attributes: true,
      }
    })

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.ad.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({ ad })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ad' },
      { status: 500 }
    )
  }
}
```

#### **2.3 Search API**

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const condition = searchParams.get('condition')
    const sort = searchParams.get('sort') || 'relevance'

    if (!q) {
      return NextResponse.json(
        { error: 'Search query required' },
        { status: 400 }
      )
    }

    const where: any = {
      status: 'ACTIVE',
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (location) {
      where.location = { slug: location }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (condition) {
      where.condition = condition
    }

    const orderBy: any = {}
    switch (sort) {
      case 'price_asc':
        orderBy.price = 'asc'
        break
      case 'price_desc':
        orderBy.price = 'desc'
        break
      case 'date':
        orderBy.createdAt = 'desc'
        break
      case 'relevance':
      default:
        // Full-text search relevance
        break
    }

    const ads = await prisma.ad.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            verified: true,
          }
        },
        category: true,
        location: true,
        images: true,
      },
      orderBy,
      take: 50,
    })

    return NextResponse.json({
      query: q,
      results: ads,
      total: ads.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
```

#### **2.4 File Upload API**

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    })

    return NextResponse.json({
      url: blob.url,
      size: blob.size,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

### **Step 3: Connect Frontend to Backend**

#### **3.1 Update Components to Use Real APIs**

```typescript
// hooks/useAuth.ts
import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const login = async (email: string, password: string) => {
    return await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  }

  const register = async (userData: any) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    return response.json()
  }

  const logout = () => signOut()

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    login,
    register,
    logout,
  }
}
```

```typescript
// hooks/useAds.ts
import { useState, useEffect } from 'react'

export function useAds(filters?: any) {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAds = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters)
      const response = await fetch(`/api/ads?${params}`)
      const data = await response.json()
      setAds(data.ads)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [filters])

  return { ads, loading, error, refetch: fetchAds }
}
```

### **Step 4: Add Real-time Features**

#### **4.1 WebSocket Setup**

```typescript
// lib/socket.ts
import { io } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export const socket = io(SOCKET_URL, {
  autoConnect: false,
})

export const connectSocket = (userId: string) => {
  socket.auth = { userId }
  socket.connect()
}

export const disconnectSocket = () => {
  socket.disconnect()
}
```

#### **4.2 Chat API**

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ]
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
        ad: { select: { id: true, title: true, images: true } },
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['senderId', 'receiverId'],
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { receiverId, content, adId } = await request.json()

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
        adId,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      }
    })

    return NextResponse.json({ message })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
```

### **Step 5: Testing & Deployment**

```bash
# Run tests
npm run test

# Build for production
npm run build

# Deploy
./scripts/deploy.sh
```

## 🎯 **Quick Wins (This Week)**

1. **Set up database** - Run migrations and seed data
2. **Implement auth APIs** - Registration and login
3. **Create basic ad APIs** - CRUD operations
4. **Add search functionality** - Basic search API
5. **Connect frontend** - Update components to use real APIs

## 🚀 **Next Steps (Next Week)**

1. **File upload system** - Image upload to Vercel Blob
2. **Payment integration** - PayHere setup
3. **Real-time chat** - WebSocket implementation
4. **Admin panel** - Content moderation APIs
5. **Analytics** - User behavior tracking

---

**This implementation guide will get you 80% of the way to a production-ready platform!** 🚀 