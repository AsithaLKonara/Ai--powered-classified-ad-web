import { prisma } from './db'

export interface AnalyticsEvent {
  type: string
  userId?: string
  sessionId?: string
  data: Record<string, any>
  timestamp?: Date
}

export interface PageView {
  path: string
  userId?: string
  sessionId: string
  userAgent: string
  referrer?: string
  timestamp: Date
}

export interface PerformanceMetric {
  type: 'navigation' | 'resource' | 'paint' | 'largest-contentful-paint'
  name: string
  value: number
  sessionId: string
  userId?: string
  timestamp: Date
}

export class Analytics {
  private static instance: Analytics

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await prisma.analytics.create({
        data: {
          type: event.type,
          data: {
            ...event.data,
            userId: event.userId,
            sessionId: event.sessionId,
            timestamp: event.timestamp || new Date(),
          },
        },
      })
    } catch (error) {
      console.error('Failed to track analytics event:', error)
    }
  }

  async trackPageView(pageView: PageView): Promise<void> {
    await this.trackEvent({
      type: 'page_view',
      userId: pageView.userId,
      sessionId: pageView.sessionId,
      data: {
        path: pageView.path,
        userAgent: pageView.userAgent,
        referrer: pageView.referrer,
      },
      timestamp: pageView.timestamp,
    })
  }

  async trackPerformance(metric: PerformanceMetric): Promise<void> {
    await this.trackEvent({
      type: 'performance',
      userId: metric.userId,
      sessionId: metric.sessionId,
      data: {
        metricType: metric.type,
        name: metric.name,
        value: metric.value,
      },
      timestamp: metric.timestamp,
    })
  }

  async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      type: 'error',
      data: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    })
  }

  async trackUserAction(action: string, data?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      type: 'user_action',
      data: {
        action,
        ...data,
      },
    })
  }

  async getAnalytics(type: string, startDate: Date, endDate: Date) {
    return await prisma.analytics.findMany({
      where: {
        type,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    })
  }

  async getPageViews(startDate: Date, endDate: Date) {
    const events = await this.getAnalytics('page_view', startDate, endDate)
    
    const pageViews = events.map(event => ({
      path: event.data.path,
      count: 1,
      uniqueUsers: event.data.userId ? 1 : 0,
    }))

    // Aggregate by path
    const aggregated = pageViews.reduce((acc, view) => {
      const existing = acc.find(item => item.path === view.path)
      if (existing) {
        existing.count += view.count
        existing.uniqueUsers += view.uniqueUsers
      } else {
        acc.push(view)
      }
      return acc
    }, [] as typeof pageViews)

    return aggregated.sort((a, b) => b.count - a.count)
  }

  async getPerformanceMetrics(startDate: Date, endDate: Date) {
    const events = await this.getAnalytics('performance', startDate, endDate)
    
    return events.map(event => ({
      type: event.data.metricType,
      name: event.data.name,
      value: event.data.value,
      timestamp: event.date,
    }))
  }

  async getErrorLogs(startDate: Date, endDate: Date) {
    const events = await this.getAnalytics('error', startDate, endDate)
    
    return events.map(event => ({
      message: event.data.message,
      stack: event.data.stack,
      timestamp: event.date,
      context: event.data,
    }))
  }

  async getUserActions(startDate: Date, endDate: Date) {
    const events = await this.getAnalytics('user_action', startDate, endDate)
    
    const actions = events.map(event => ({
      action: event.data.action,
      data: event.data,
      timestamp: event.date,
    }))

    // Aggregate by action
    const aggregated = actions.reduce((acc, action) => {
      const existing = acc.find(item => item.action === action.action)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({ ...action, count: 1 })
      }
      return acc
    }, [] as (typeof actions[0] & { count: number })[])

    return aggregated.sort((a, b) => b.count - a.count)
  }
}

export const analytics = Analytics.getInstance() 