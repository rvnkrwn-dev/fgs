// ========================================
// DASHBOARD RECENT REGISTRATIONS API
// /server/api/dashboard/recent-registrations.get.ts
// ========================================

import { prisma } from '~/server/config/db'

export default defineEventHandler(async (event) => {
    try {
        // Get query parameters
        const query = getQuery(event)
        const limit = parseInt(query.limit as string) || 5
        const hours = parseInt(query.hours as string) || 24

        const dateFrom = new Date(Date.now() - hours * 60 * 60 * 1000)

        // Get recent registrations with event details
        const recentRegistrations = await prisma.eventRegistration.findMany({
            select: {
                id: true,
                full_name: true,
                whatsapp: true,
                province: true,
                city: true,
                registered_at: true,
                event: {
                    select: {
                        id: true,
                        title: true,
                        start_date: true,
                        location: true,
                        status: true
                    }
                }
            },
            orderBy: {
                registered_at: 'desc'
            },
            take: limit
        })

        // Get additional statistics
        const [
            totalToday,
            totalThisWeek,
            totalThisMonth,
            hourlyRegistrations
        ] = await Promise.all([
            // Today's registrations
            prisma.eventRegistration.count({
                where: {
                    registered_at: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),

            // This week's registrations
            prisma.eventRegistration.count({
                where: {
                    registered_at: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),

            // This month's registrations
            prisma.eventRegistration.count({
                where: {
                    registered_at: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),

            // Hourly breakdown for last 24 hours
            prisma.$queryRaw`
        SELECT 
          HOUR(registered_at) as hour,
          COUNT(*) as count
        FROM EventRegistration 
        WHERE registered_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        GROUP BY HOUR(registered_at)
        ORDER BY hour
      `
        ])

        // Transform hourly data for chart
        const hourlyData = Array.from({ length: 24 }, (_, i) => {
            const hourData = (hourlyRegistrations as any[]).find(h => h.hour === i)
            return {
                hour: i,
                count: hourData ? parseInt(hourData.count) : 0,
                label: `${i.toString().padStart(2, '0')}:00`
            }
        })

        // Calculate trends
        const currentHour = new Date().getHours()
        const previousHourRegistrations = hourlyData[currentHour - 1]?.count || 0
        const currentHourRegistrations = hourlyData[currentHour]?.count || 0

        const hourlyTrend = currentHourRegistrations - previousHourRegistrations
        const trendDirection = hourlyTrend > 0 ? 'up' : hourlyTrend < 0 ? 'down' : 'stable'

        return {
            statusCode: 200,
            message: 'Recent registrations retrieved successfully',
            data: recentRegistrations,
            meta: {
                statistics: {
                    totalToday,
                    totalThisWeek,
                    totalThisMonth,
                    showing: recentRegistrations.length,
                    timeRange: `${hours} jam terakhir`
                },
                trends: {
                    hourlyTrend,
                    trendDirection,
                    currentHourRegistrations,
                    previousHourRegistrations
                },
                hourlyBreakdown: hourlyData
            }
        }

    } catch (error: any) {
        console.error('Error fetching recent registrations:', error)

        return {
            statusCode: 500,
            message: 'Internal server error',
            error: error?.message
        }
    }
})