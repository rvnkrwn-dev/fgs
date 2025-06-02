// ========================================
// EVENT REGISTRATION MODEL
// ========================================
import {prisma} from "~/server/config/db";
import {Prisma} from "~/lib/generated/prisma";

export class EventRegistrationModel {
    // Create Registration
    static async createRegistration(data: {
        event_id: string;
        full_name: string;
        whatsapp: string;
        province: string;
        city: string;
        district: string;
        postal_code: string;
    }) {
        return prisma.eventRegistration.create({
            data: {
                event_id: data.event_id,
                full_name: data.full_name,
                whatsapp: data.whatsapp,
                province: data.province,
                city: data.city,
                district: data.district,
                postal_code: data.postal_code
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        start_date: true,
                        end_date: true,
                        location: true
                    }
                }
            }
        });
    }

    // Get All Registrations with pagination and filters
    static async getAllRegistrations(params: {
        page?: number;
        limit?: number;
        event_id?: string;
        search?: string;
        province?: string;
        city?: string;
    } = {}) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: Prisma.EventRegistrationWhereInput = {};

        if (params.event_id) {
            where.event_id = params.event_id;
        }

        if (params.search) {
            where.OR = [
                { full_name: { contains: params.search } },
                { whatsapp: { contains: params.search } }
            ];
        }

        if (params.province) {
            where.province = { contains: params.province };
        }

        if (params.city) {
            where.city = { contains: params.city };
        }

        const [registrations, total] = await Promise.all([
            prisma.eventRegistration.findMany({
                where,
                skip,
                take: limit,
                include: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            start_date: true,
                            location: true
                        }
                    }
                },
                orderBy: {
                    registered_at: 'desc'
                }
            }),
            prisma.eventRegistration.count({ where })
        ]);

        return {
            registrations,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // Get Registration by ID
    static async getRegistrationById(registrationId: string) {
        return prisma.eventRegistration.findUnique({
            where: { id: registrationId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        start_date: true,
                        end_date: true,
                        location: true,
                        banner_url: true
                    }
                }
            }
        });
    }

    // Get Registrations by Event
    static async getRegistrationsByEvent(eventId: string) {
        return prisma.eventRegistration.findMany({
            where: { event_id: eventId },
            orderBy: {
                registered_at: 'desc'
            }
        });
    }

    // Update Registration
    static async updateRegistration(registrationId: string, data: Prisma.EventRegistrationUpdateInput) {
        return prisma.eventRegistration.update({
            where: { id: registrationId },
            data,
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        start_date: true,
                        location: true
                    }
                }
            }
        });
    }

    // Delete Registration
    static async deleteRegistration(registrationId: string) {
        return prisma.eventRegistration.delete({
            where: { id: registrationId }
        });
    }

    // Get Registration Statistics
    static async getRegistrationStats(eventId?: string) {
        const where = eventId ? { event_id: eventId } : {};

        const [total, byProvince, byCity, recent] = await Promise.all([
            // Total registrations
            prisma.eventRegistration.count({ where }),

            // Group by province
            prisma.eventRegistration.groupBy({
                by: ['province'],
                where,
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } }
            }),

            // Group by city
            prisma.eventRegistration.groupBy({
                by: ['city'],
                where,
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 10
            }),

            // Recent registrations (last 7 days)
            prisma.eventRegistration.count({
                where: {
                    ...where,
                    registered_at: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);

        return {
            total,
            recent,
            byProvince: byProvince.map(item => ({
                province: item.province,
                count: item._count.id
            })),
            byCity: byCity.map(item => ({
                city: item.city,
                count: item._count.id
            }))
        };
    }

    // Check if WhatsApp already registered for event
    static async isWhatsAppRegistered(eventId: string, whatsapp: string) {
        const registration = await prisma.eventRegistration.findFirst({
            where: {
                event_id: eventId,
                whatsapp: whatsapp
            }
        });
        return !!registration;
    }

    // Export registrations for event (for CSV export)
    static async exportEventRegistrations(eventId: string) {
        return prisma.eventRegistration.findMany({
            where: { event_id: eventId },
            select: {
                full_name: true,
                whatsapp: true,
                province: true,
                city: true,
                district: true,
                postal_code: true,
                registered_at: true
            },
            orderBy: {
                registered_at: 'asc'
            }
        });
    }
}