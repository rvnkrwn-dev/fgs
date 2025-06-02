// ========================================
// DASHBOARD OVERVIEW API (COMBINED)
// /server/api/dashboard/overview.get.ts
// ========================================

import { prisma } from '~/server/config/db'

export default defineEventHandler(async (event) => {
    try {
        const now = new Date()
        const todayStart = new Date(now.setHours(0, 0, 0, 0))
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        // Execute all queries in parallel for better performance
        const [
            // Basic counts
            totalEvents,
            publishedEvents,
            draftEvents,
            totalRegistrations,
            todayRegistrations,

            // Recent data
            recentRegistrations,
            upcomingEvents,
            topProvinces,

            // Geographic data
            uniqueProvinces,

            // Additional stats
            thisWeekRegistrations,
            thisMonthRegistrations
        ] = await Promise.all([
            // Event counts
            prisma.event.count(),
            prisma.event.count({ where: { status: 'PUBLISHED' } }),
            prisma.event.count({ where: { status: 'DRAFT' } }),

            // Registration counts
            prisma.eventRegistration.count(),
            prisma.eventRegistration.count({
                where: { registered_at: { gte: todayStart } }
            }),

            // Recent registrations (5 latest)
            prisma.eventRegistration.findMany({
                select: {
                    id: true,
                    full_name: true,
                    province: true,
                    registered_at: true,
                    event: {
                        select: {
                            id: true,
                            title: true,
                            start_date: true,
                            location: true
                        }
                    }
                },
                orderBy: { registered_at: 'desc' },
                take: 5
            }),

            // Upcoming events (5 next)
            prisma.event.findMany({
                where: {
                    start_date: { gte: new Date() },
                    status: 'PUBLISHED'
                },
                select: {
                    id: true,
                    title: true,
                    start_date: true,
                    location: true,
                    banner_url: true,
                    cover_url: true,
                    status: true,
                    _count: {
                        select: { registrations: true }
                    }
                },
                orderBy: { start_date: 'asc' },
                take: 5
            }),

            // Top 5 provinces
            prisma.eventRegistration.groupBy({
                by: ['province'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 5
            }),

            // Unique provinces
            prisma.eventRegistration.findMany({
                select: { province: true },
                distinct: ['province']
            }),

            // Week registrations
            prisma.eventRegistration.count({
                where: { registered_at: { gte: weekAgo } }
            }),

            // Month registrations
            prisma.eventRegistration.count({
                where: { registered_at: { gte: monthStart } }
            })
        ])

        // Calculate derived statistics
        const averageParticipants = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0
        const totalProvinces = uniqueProvinces.length

        // Transform provinces data
        const provincesData = topProvinces.map((item, index) => ({
            rank: index + 1,
            name: item.province,
            count: item._count.id,
            percentage: totalRegistrations > 0
                ? Math.round((item._count.id / totalRegistrations) * 100)
                : 0
        }))

        // Generate mock activities (you can replace this with real activity logging later)
        const recentActivities = [
            ...recentRegistrations.slice(0, 3).map(reg => ({
                id: `reg_${reg.id}`,
                type: 'registration',
                title: 'Registrasi Baru',
                description: `${reg.full_name} dari ${reg.province} mendaftar untuk ${reg.event.title}`,
                created_at: reg.registered_at
            })),
            // You can add more activity types here
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        const response = {
            statusCode: 200,
            message: 'Dashboard overview retrieved successfully',
            data: {
                // Main statistics
                stats: {
                    totalEvents,
                    publishedEvents,
                    draftEvents,
                    totalRegistrations,
                    todayRegistrations,
                    thisWeekRegistrations,
                    thisMonthRegistrations,
                    averageParticipants,
                    totalProvinces
                },

                // Widget data
                recentRegistrations,
                upcomingEvents,
                topProvinces: provincesData,
                recentActivities,

                // Metadata
                meta: {
                    lastUpdated: new Date().toISOString(),
                    dataFreshness: 'real-time',
                    cacheExpiry: null
                }
            }
        }

        return response

    } catch (error: any) {
        console.error('Error fetching dashboard overview:', error)

        return {
            statusCode: 500,
            message: 'Internal server error',
            error: error?.message
        }
    }
})