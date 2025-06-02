// ========================================
// EVENT MODEL
// ========================================

import {prisma} from "~/server/config/db";
import {$Enums, Prisma} from "~/lib/generated/prisma";
import EventStatus = $Enums.EventStatus;

export class EventModel {
    // Create Event
    static async createEvent(data: {
        title: string;
        description: string;
        start_date: Date;
        end_date: Date;
        location: string;
        banner_url?: string;
        cover_url?: string; // Added cover_url
        status?: EventStatus;
        creator_id: string;
    }) {
        return prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                start_date: data.start_date,
                end_date: data.end_date,
                location: data.location,
                banner_url: data.banner_url,
                cover_url: data.cover_url, // Added cover_url
                status: data.status || EventStatus.DRAFT,
                creator_id: data.creator_id
            },
            include: {
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
            }
        });
    }

    // Get All Events with pagination and filters
    static async getAllEvents(params: {
        page?: number;
        limit?: number;
        status?: EventStatus;
        search?: string;
        creator_id?: string;
    } = {}) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: Prisma.EventWhereInput = {};

        if (params.status) {
            where.status = params.status;
        }

        if (params.search) {
            where.OR = [
                { title: { contains: params.search } },
                { description: { contains: params.search } },
                { location: { contains: params.search } }
            ];
        }

        if (params.creator_id) {
            where.creator_id = params.creator_id;
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: limit,
                include: {
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
                    created_at: 'desc'
                }
            }),
            prisma.event.count({ where })
        ]);

        return {
            events,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // Get Event by ID
    static async getEventById(eventId: string) {
        return prisma.event.findUnique({
            where: { id: eventId },
            include: {
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
            }
        });
    }

    // Update Event
    static async updateEvent(eventId: string, data: Prisma.EventUpdateInput) {
        return prisma.event.update({
            where: { id: eventId },
            data,
            include: {
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
            }
        });
    }

    // Delete Event
    static async deleteEvent(eventId: string) {
        return prisma.event.delete({
            where: { id: eventId }
        });
    }

    // Get Events by Status
    static async getEventsByStatus(status: EventStatus) {
        return prisma.event.findMany({
            where: { status },
            include: {
                created_by: {
                    select: {
                        id: true,
                        name: true
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
            }
        });
    }

    // Get Published Events (for public)
    static async getPublishedEvents() {
        return prisma.event.findMany({
            where: {
                status: EventStatus.PUBLISHED,
                start_date: {
                    gte: new Date() // Only future events
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
                cover_url: true, // Added cover_url to select
                _count: {
                    select: {
                        registrations: true
                    }
                }
            },
            orderBy: {
                start_date: 'asc'
            }
        });
    }

    // Get Events by Creator
    static async getEventsByCreator(creatorId: string) {
        return prisma.event.findMany({
            where: { creator_id: creatorId },
            include: {
                _count: {
                    select: {
                        registrations: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }
}