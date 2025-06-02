// ========================================
// USER MODEL
// ========================================
import {prisma} from "~/server/config/db";
import {$Enums, Prisma} from "~/lib/generated/prisma";
import UserRole = $Enums.UserRole;

export class UserModel {
    // Create User
    static async createUser(data: {
        email: string;
        name: string;
        password_hash: string;
        role?: UserRole;
    }) {
        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password_hash: data.password_hash,
                role: data.role || UserRole.USER
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        });
    }

    // Get All Users with pagination
    static async getAllUsers(params: {
        page?: number;
        limit?: number;
        role?: UserRole;
        search?: string;
    } = {}) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {};

        if (params.role) {
            where.role = params.role;
        }

        if (params.search) {
            where.OR = [
                { name: { contains: params.search } },
                { email: { contains: params.search } }
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    created_at: true,
                    updated_at: true,
                    _count: {
                        select: {
                            events_created: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            }),
            prisma.user.count({ where })
        ]);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // Get User by ID
    static async getUserById(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
                updated_at: true,
                _count: {
                    select: {
                        events_created: true
                    }
                }
            }
        });
    }

    // Get User by Email
    static async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password_hash: true,
                created_at: true,
                updated_at: true
            }
        });
    }

    // Update User
    static async updateUser(userId: string, data: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        });
    }

    // Delete User
    static async deleteUser(userId: string) {
        return prisma.user.delete({
            where: { id: userId }
        });
    }

    // Get Users by Role
    static async getUsersByRole(role: UserRole) {
        return prisma.user.findMany({
            where: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    }
}