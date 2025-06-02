// ========================================
// GET REGISTRATION BY ID API
// ========================================
// File: ~/server/api/registrations/[id].get.ts

import { EventRegistrationModel } from "~/server/model/eventRegistrationModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

export default defineEventHandler(async (event) => {
    try {
        const registrationId = getRouterParam(event, 'id');

        if (!registrationId) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: 'Registration ID diperlukan' };
        }

        const registration = await EventRegistrationModel.getRegistrationById(registrationId);

        if (!registration) {
            setResponseStatus(event, 404);
            return { statusCode: 404, message: 'Registrasi tidak ditemukan' };
        }

        return {
            statusCode: 200,
            message: 'Data registrasi berhasil diambil',
            data: { registration }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});