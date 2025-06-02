import bcrypt from "bcryptjs";
import {UserModel} from "~/server/model/userModel";
import {errorHandlingTransform} from "~/server/utils/errorHandlingUtils";
import {generateToken, sendRefreshToken} from "~/server/utils/jwtUtils";
import {RefreshTokenModel} from "~/server/model/refreshTokenModel";

const validateLoginInput = (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) {
        return {isValid: false, message: 'Pastikan telah mengisi dengan benar dan lengkap'};
    }
    return {isValid: true};
};

export default defineEventHandler(async (event) => {
    try {
        const {email, password} = await readBody(event);

        const inputValidation = validateLoginInput(email, password);
        if (!inputValidation.isValid) {
            setResponseStatus(event, 400);
            return {statusCode: 400, message: inputValidation.message};
        }

        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            setResponseStatus(event, 401);
            return {
                statusCode: 401,
                message: 'User tidak ditemukan',
            };
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            setResponseStatus(event, 401);
            return {
                statusCode: 401,
                message: 'Password tidak sesuai',
            };
        }

        const {password_hash, ...userData} = user;

        const {accessToken, refreshToken} = generateToken({
            userId: userData.id,
        })

        await RefreshTokenModel.createRefreshToken({user_id: userData.id, token: refreshToken});
        sendRefreshToken(event, refreshToken);

        return {
            statusCode: 200,
            message: 'Login berhasil!',
            data: {
                user: userData,
                access_token: accessToken,
            },
        };
    } catch (error: any) {
        const {statusCode, message} = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return {
            statusCode,
            message,
        };
    }
});
