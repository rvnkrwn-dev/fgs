// ========================================
// GET EVENT BY ID API
// ========================================
// File: ~/server/api/events/[id].get.ts

import { EventModel } from "~/server/model/eventModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

export default defineEventHandler(async (event) => {
    try {
        const eventId = getRouterParam(event, 'id');

        if (!eventId) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: 'Event ID diperlukan' };
        }

        const eventData = await EventModel.getEventById(eventId);

        if (!eventData) {
            setResponseStatus(event, 404);
            return { statusCode: 404, message: 'Event tidak ditemukan' };
        }

        return {
            statusCode: 200,
            message: 'Data event berhasil diambil',
            data: { event: eventData }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});