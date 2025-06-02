// ========================================
// DASHBOARD UPCOMING EVENTS API
// /server/api/dashboard/upcoming-events.get.ts
// ========================================

import { prisma } from '~/server/config/db'

export default defineEventHandler(async (event) => {
    try {
        // Get query parameters
        const query = getQuery(event)
        const limit = parseInt(query.limit as string) || 5
        const days = parseInt(query.days as string) || 30

        const now = new Date()
        const dateTo = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

        // Get upcoming events
        const upcomingEvents = await prisma.event.findMany({
            where: {
                start_date: {
                    gte: now,
                    lte: dateTo
                },
                status: {
                    in: ['PUBLISHED', 'DRAFT'] // Include both published and draft for admin
                }
            },
            select: {
                id: true,
                title: true,
                description: true,
                start_date: true,
                end_date: true,
                location: true,
                banner_url: true,
                cover_url: true,
                status: true,
                created_at: true,
                updated_at: true,
                created_by: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        registrations: true
                    }
                }
            },
            orderBy: {
                start_date: 'asc'
            },
            take: limit
        })

        // Get additional event statistics
        const [
            totalUpcoming,
            publishedUpcoming,
            draftUpcoming,
            eventsThisMonth,
            nearestEvent
        ] = await Promise.all([
            // Total upcoming events
            prisma.event.count({
                where: {
                    start_date: { gte: now },
                    status: { in: ['PUBLISHED', 'DRAFT'] }
                }
            }),

            // Published upcoming events
            prisma.event.count({
                where: {
                    start_date: { gte: now },
                    status: 'PUBLISHED'
                }
            }),

            // Draft upcoming events
            prisma.event.count({
                where: {
                    start_date: { gte: now },
                    status: 'DRAFT'
                }
            }),

            // Events this month
            prisma.event.count({
                where: {
                    start_date: {
                        gte: new Date(now.getFullYear(), now.getMonth(), 1),
                        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                    }
                }
            }),

            // Nearest event
            prisma.event.findFirst({
                where: {
                    start_date: { gte: now },
                    status: 'PUBLISHED'
                },
                select: {
                    id: true,
                    title: true,
                    start_date: true,
                    location: true
                },
                orderBy: {
                    start_date: 'asc'
                }
            })
        ])

        // Calculate days until nearest event
        const daysUntilNearest = nearestEvent
            ? Math.ceil((new Date(nearestEvent.start_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : null

        // Add additional metadata to each event
        const eventsWithMetadata = upcomingEvents.map(eventItem => {
            const daysUntil = Math.ceil((new Date(eventItem.start_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            const isToday = daysUntil === 0
            const isTomorrow = daysUntil === 1
            const isThisWeek = daysUntil <= 7

            return {
                ...eventItem,
                metadata: {
                    daysUntil,
                    isToday,
                    isTomorrow,
                    isThisWeek,
                    registrationCount: eventItem._count.registrations,
                    isPublished: eventItem.status === 'PUBLISHED',
                    urgency: daysUntil <= 3 ? 'high' : daysUntil <= 7 ? 'medium' : 'low'
                }
            }
        })

        return {
            statusCode: 200,
            message: 'Upcoming events retrieved successfully',
            data: eventsWithMetadata,
            meta: {
                statistics: {
                    totalUpcoming,
                    publishedUpcoming,
                    draftUpcoming,
                    eventsThisMonth,
                    showing: upcomingEvents.length,
                    timeRange: `${days} hari ke depan`
                },
                nearestEvent: nearestEvent ? {
                    ...nearestEvent,
                    daysUntil: daysUntilNearest
                } : null,
                filters: {
                    limit,
                    days,
                    dateRange: {
                        from: now.toISOString(),
                        to: dateTo.toISOString()
                    }
                }
            }
        }

    } catch (error: any) {
        console.error('Error fetching upcoming events:', error)

        return {
            statusCode: 500,
            message: 'Internal server error',
            error: error?.message
        }
    }
})