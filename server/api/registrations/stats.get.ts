// ========================================
// GET REGISTRATION STATISTICS API
// ========================================
// File: ~/server/api/registrations/stats.get.ts

import { EventRegistrationModel } from "~/server/model/eventRegistrationModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const eventId = query.event_id as string;

        const stats = await EventRegistrationModel.getRegistrationStats(eventId);

        return {
            statusCode: 200,
            message: 'Statistik registrasi berhasil diambil',
            data: { stats }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});