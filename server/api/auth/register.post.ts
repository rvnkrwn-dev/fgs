import bcrypt from "bcryptjs";
import { UserModel } from "~/server/model/userModel";
import {errorHandlingTransform} from "~/server/utils/errorHandlingUtils";

const validateRegisterInput = (email: string, name: string, password: string) => {
    if (!email?.trim() || !name?.trim() || !password?.trim()) {
        return { isValid: false, message: 'Pastikan telah mengisi dengan benar dan lengkap' };
    }
    return { isValid: true };
};

const checkUserExists = async (email: string) => {
    const user = await UserModel.getUserByEmail(email.trim());
    if (user) {
        return { exists: true, message: 'Email sudah terdaftar' };
    }
    return { exists: false };
};

const createUser = async (email: string, name: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10); // async hash
    return await UserModel.createUser({
        email: email.trim(),
        name: name.trim(),
        password_hash: hashedPassword
    });
};

export default defineEventHandler(async (event) => {
    try {
        const { email, name, password } = await readBody(event);

        const inputValidation = validateRegisterInput(email, name, password);
        if (!inputValidation.isValid) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: inputValidation.message };
        }

        const userCheck = await checkUserExists(email);
        if (userCheck.exists) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: userCheck.message };
        }

        const newUser = await createUser(email, name, password);

        return {
            statusCode: 201,
            message: 'Registrasi Berhasil!',
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                },
            },
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