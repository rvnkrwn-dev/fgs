// ========================================
// DASHBOARD ACTIVITIES API
// /server/api/dashboard/activities.get.ts
// ========================================

import { prisma } from '~/server/config/db'

export default defineEventHandler(async (event) => {
    try {
        // Get query parameters
        const query = getQuery(event)
        const limit = parseInt(query.limit as string) || 10
        const days = parseInt(query.days as string) || 7

        const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

        // Get recent events (created, updated, published)
        const [recentEvents, recentRegistrations] = await Promise.all([
            // Recent events with their status changes
            prisma.event.findMany({
                where: {
                    OR: [
                        { created_at: { gte: dateFrom } },
                        { updated_at: { gte: dateFrom } }
                    ]
                },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    created_at: true,
                    updated_at: true,
                    created_by: {
                        select: {
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
                    updated_at: 'desc'
                },
                take: limit * 2 // Get more to mix with registrations
            }),

            // Recent registrations
            prisma.eventRegistration.findMany({
                where: {
                    registered_at: { gte: dateFrom }
                },
                select: {
                    id: true,
                    full_name: true,
                    province: true,
                    registered_at: true,
                    event: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                },
                orderBy: {
                    registered_at: 'desc'
                },
                take: limit * 2 // Get more to mix with events
            })
        ])

        // Transform events into activities
        const eventActivities = recentEvents.map(eventItem => {
            const isNew = eventItem.created_at.getTime() === eventItem.updated_at.getTime()

            return {
                id: `event_${eventItem.id}`,
                type: isNew ? 'event_created' :
                    eventItem.status === 'PUBLISHED' ? 'event_published' : 'event_updated',
                title: isNew ? 'Event Baru Dibuat' :
                    eventItem.status === 'PUBLISHED' ? 'Event Dipublikasi' : 'Event Diperbarui',
                description: isNew
                    ? `Event "${eventItem.title}" telah dibuat oleh ${eventItem.created_by.name}`
                    : eventItem.status === 'PUBLISHED'
                        ? `Event "${eventItem.title}" telah dipublikasi dan tersedia untuk registrasi`
                        : `Event "${eventItem.title}" telah diperbarui`,
                created_at: isNew ? eventItem.created_at : eventItem.updated_at,
                metadata: {
                    event_id: eventItem.id,
                    event_title: eventItem.title,
                    event_status: eventItem.status,
                    creator_name: eventItem.created_by.name,
                    registrations_count: eventItem._count.registrations
                }
            }
        })

        // Transform registrations into activities
        const registrationActivities = recentRegistrations.map(registration => ({
            id: `registration_${registration.id}`,
            type: 'registration',
            title: 'Registrasi Baru',
            description: `${registration.full_name} dari ${registration.province} mendaftar untuk "${registration.event.title}"`,
            created_at: registration.registered_at,
            metadata: {
                registration_id: registration.id,
                participant_name: registration.full_name,
                participant_province: registration.province,
                event_id: registration.event.id,
                event_title: registration.event.title
            }
        }))

        // Combine and sort all activities
        const allActivities = [...eventActivities, ...registrationActivities]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit)

        // Get activity summary stats
        const activityStats = {
            totalActivities: allActivities.length,
            eventActivities: eventActivities.length,
            registrationActivities: registrationActivities.length,
            timeRange: `${days} hari terakhir`,
            oldestActivity: allActivities.length > 0 ? allActivities[allActivities.length - 1].created_at : null,
            newestActivity: allActivities.length > 0 ? allActivities[0].created_at : null
        }

        return {
            statusCode: 200,
            message: 'Recent activities retrieved successfully',
            data: allActivities,
            meta: activityStats
        }

    } catch (error: any) {
        console.error('Error fetching dashboard activities:', error)

        return {
            statusCode: 500,
            message: 'Internal server error',
            error: error?.message
        }
    }
})