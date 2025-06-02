// ========================================
// DASHBOARD PROVINCES API
// /server/api/dashboard/provinces.get.ts
// ========================================

import { prisma } from '~/server/config/db'

export default defineEventHandler(async (event) => {
    try {
        // Get query parameters
        const query = getQuery(event)
        const limit = parseInt(query.limit as string) || 10

        // Get provinces with registration counts
        const provincesData = await prisma.eventRegistration.groupBy({
            by: ['province'],
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: limit
        })

        // Transform data to more readable format
        const provinces = provincesData.map((item, index) => ({
            rank: index + 1,
            name: item.province,
            count: item._count.id,
            percentage: 0 // Will be calculated below
        }))

        // Calculate total registrations for percentage calculation
        const totalRegistrations = await prisma.eventRegistration.count()

        // Add percentage to each province
        provinces.forEach(province => {
            province.percentage = totalRegistrations > 0
                ? Math.round((province.count / totalRegistrations) * 100)
                : 0
        })

        // Get additional province statistics
        const [
            totalProvinces,
            topProvince,
            recentProvinces
        ] = await Promise.all([
            // Total unique provinces
            prisma.eventRegistration.findMany({
                select: { province: true },
                distinct: ['province']
            }).then(data => data.length),

            // Top province
            provinces.length > 0 ? provinces[0] : null,

            // New provinces in last 30 days
            prisma.eventRegistration.findMany({
                where: {
                    registered_at: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                },
                select: { province: true },
                distinct: ['province']
            }).then(data => data.length)
        ])

        return {
            statusCode: 200,
            message: 'Province statistics retrieved successfully',
            data: provinces,
            meta: {
                totalProvinces,
                topProvince,
                recentProvinces,
                totalRegistrations,
                limit,
                showing: provinces.length
            }
        }

    } catch (error) {
        console.error('Error fetching province statistics:', error)

        return {
            statusCode: 500,
            message: 'Internal server error',
            error: error.message
        }
    }
})