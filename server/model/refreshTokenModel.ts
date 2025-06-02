// ========================================
// REFRESH TOKEN MODEL - SESUAI SCHEMA EXISTING
// ========================================
import {prisma} from "~/server/config/db";

export class RefreshTokenModel {
    // Create Refresh Token
    static async createRefreshToken(data: {
        user_id: string;
        token: string;
    }) {
        RefreshTokenModel.deleteRefreshToken({user_id: data.user_id});
        return prisma.refreshToken.create({
            data: {
                user_id: data.user_id,
                token: data.token,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                }
            }
        });
    }

    // Get Refresh Token by Token String
    static async getRefreshToken(token: string) {
        return prisma.refreshToken.findFirst({
            where: {
                token: token
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                }
            }
        });
    }

    // Get Refresh Token by User ID
    static async getRefreshTokenByUserId(userId: string) {
        return prisma.refreshToken.findFirst({
            where: {
                user_id: userId
            },
        });
    }

    // Delete Refresh Token by User ID
    static async deleteRefreshToken(data: {user_id: string}) {
        return prisma.refreshToken.deleteMany({
            where: {
                user_id: data.user_id
            }
        });
    }
}