import { UserModel } from "~/server/model/userModel";
import { RefreshTokenModel } from "~/server/model/refreshTokenModel";
import { decodeRefreshToken } from "~/server/utils/jwtUtils";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";
import { getCookie, setResponseStatus, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const refreshToken = getCookie(event, 'refresh_token');
        if (!refreshToken) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: 'Tidak ada refresh token yang ditemukan dalam cookie.' };
        }

        // Decode & verify refresh token
        let decoded: any;
        try {
            decoded = decodeRefreshToken(refreshToken);
        } catch (error) {
            setResponseStatus(event, 403);
            return { statusCode: 403, message: 'Refresh token tidak valid.' };
        }

        // Validate token exists in DB
        const storedToken = await RefreshTokenModel.getRefreshTokenByUserId(decoded.user_id);
        if (!storedToken || storedToken.token !== refreshToken) {
            setResponseStatus(event, 403);
            return { statusCode: 403, message: 'Refresh token tidak valid atau telah dicabut.' };
        }

        // Check user existence
        const user = await UserModel.getUserById(storedToken.user_id);
        if (!user) {
            setResponseStatus(event, 403);
            return { statusCode: 403, message: 'Pengguna tidak ditemukan.' };
        }

        // Delete refresh token from DB
        await RefreshTokenModel.deleteRefreshToken({ user_id: user.id });

        // Clear cookie
        deleteCookie(event, 'refresh_token');

        return {
            statusCode: 200,
            message: 'Anda berhasil logout!',
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return {
            statusCode,
            message,
        };
    } finally {
        deleteCookie(event, 'refresh_token');
    }
});
