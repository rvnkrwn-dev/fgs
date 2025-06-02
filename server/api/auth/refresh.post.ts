import { UserModel } from "~/server/model/userModel";
import { RefreshTokenModel } from "~/server/model/refreshTokenModel";
import { decodeRefreshToken, generateAccessToken } from "~/server/utils/jwtUtils";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

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
        const storedToken = await RefreshTokenModel.getRefreshTokenByUserId(decoded.userId);
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

        // All good – generate new access token
        const {accessToken} = generateToken({
            user_id: user.id,
            email: user.email,
        });

        return {
            statusCode: 200,
            message: 'Token akses baru berhasil dibuat!',
            data: {
                access_token: accessToken,
                user,
            }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return {
            statusCode,
            message,
        };
    }
});