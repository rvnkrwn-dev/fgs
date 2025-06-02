import UrlPattern from "url-pattern";
import { UserModel } from "~/server/model/userModel";
import { decodeAccessToken } from "~/server/utils/jwtUtils";

export default defineEventHandler(async (event) => {
    try {
        const url = event.req.url || "";
        const method = event.req.method?.toUpperCase() || "GET";

        // Daftar endpoint yang butuh autentikasi dan metode yang diizinkan
        const endpoints = [
            { url: '/api/events*', methods: ['PUT', 'POST', 'DELETE', 'PATCH'] },
        ];

        // Cek apakah URL dan method cocok dengan daftar endpoint
        const isHandledByThisMiddleware = endpoints.some(({ url: patternUrl, methods }) => {
            const pattern = new UrlPattern(patternUrl);
            return pattern.match(url) && methods.includes(method);
        });

        if (!isHandledByThisMiddleware) {
            return;
        }

        // Ambil token dari header
        const token = event.req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Token missing'
            }));
        }

        // Decode token
        const decoded = decodeAccessToken(token);

        if (!decoded || !decoded.user_id) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Invalid token'
            }));
        }

        // Ambil users berdasarkan ID
        const user = await UserModel.getUserById(decoded.user_id);

        if (!user) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: 'User not found'
            }));
        }

        // @ts-ignore
        const { password_hash, ...safeUser } = user;

        // Tambahkan ke context
        event.context.auth = { user: safeUser };

    } catch (e) {
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        }));
    }
});