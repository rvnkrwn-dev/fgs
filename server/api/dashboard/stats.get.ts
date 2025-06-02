// ========================================
// DASHBOARD STATS API
// /server/api/dashboard/stats.get.ts
// ========================================

import { prisma } from '~/server/config/db'

export default defineEventHandler(async (event) => {
    try {
        const [
            // Event Statistics
            totalEvents,
            publishedEvents,
            draftEvents,
            completedEvents,
            cancelledEvents,

            // Registration Statistics
            totalRegistrations,
            todayRegistrations,
            thisWeekRegistrations,
            thisMonthRegistrations,

            // Geographic Statistics
            uniqueProvinces,
            uniqueCities,

            // Recent activity counts
            recentEvents,
            recentRegistrations
        ] = await Promise.all([
            // Event counts by status
            prisma.event.count(),
            prisma.event.count({ where: { status: 'PUBLISHED' } }),
            prisma.event.count({ where: { status: 'DRAFT' } }),
            prisma.event.count({ where: { status: 'COMPLETED' } }),
            prisma.event.count({ where: { status: 'CANCELLED' } }),

            // Registration counts
            prisma.eventRegistration.count(),

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

            // Unique provinces count
            prisma.eventRegistration.findMany({
                select: { province: true },
                distinct: ['province']
            }),

            // Unique cities count
            prisma.eventRegistration.findMany({
                select: { city: true },
                distinct: ['city']
            }),

            // Recent events (last 30 days)
            prisma.event.count({
                where: {
                    created_at: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            }),

            // Recent registrations (last 7 days)
            prisma.eventRegistration.count({
                where: {
                    registered_at: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ])

        // Calculate average participants per event
        const averageParticipants = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0

        // Calculate growth rates
        const weeklyGrowthRate = thisWeekRegistrations
        const monthlyGrowthRate = thisMonthRegistrations

        const stats = {
            // Event Statistics
            totalEvents,
            publishedEvents,
            draftEvents,
            completedEvents,
            cancelledEvents,

            // Registration Statistics
            totalRegistrations,
            todayRegistrations,
            thisWeekRegistrations,
            thisMonthRegistrations,
            averageParticipants,

            // Geographic Statistics
            totalProvinces: uniqueProvinces.length,
            totalCities: uniqueCities.length,

            // Growth Statistics
            weeklyGrowthRate,
            monthlyGrowthRate,

            // Recent Activity
            recentEvents,
            recentRegistrations,

            // Conversion Rates
            eventCompletionRate: totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0,
            publicationRate: totalEvents > 0 ? Math.round((publishedEvents / totalEvents) * 100) : 0
        }

        return {
            statusCode: 200,
            message: 'Dashboard stats retrieved successfully',
            data: stats
        }

    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error)

        return {
            statusCode: 500,
            message: 'Internal server error',
            error: error.message
        }
    }
})