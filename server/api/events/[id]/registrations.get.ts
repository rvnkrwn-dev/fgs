// ========================================
// GET REGISTRATIONS BY EVENT API
// ========================================
// File: ~/server/api/events/[id]/registrations.get.ts

import { EventRegistrationModel } from "~/server/model/eventRegistrationModel";
import { EventModel } from "~/server/model/eventModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

export default defineEventHandler(async (event) => {
    try {
        const eventId = getRouterParam(event, 'id');

        if (!eventId) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: 'Event ID diperlukan' };
        }

        // Check if event exists
        const existingEvent = await EventModel.getEventById(eventId);
        if (!existingEvent) {
            setResponseStatus(event, 404);
            return { statusCode: 404, message: 'Event tidak ditemukan' };
        }

        const registrations = await EventRegistrationModel.getRegistrationsByEvent(eventId);

        return {
            statusCode: 200,
            message: 'Data registrasi event berhasil diambil',
            data: {
                event: {
                    id: existingEvent.id,
                    title: existingEvent.title,
                    start_date: existingEvent.start_date,
                    location: existingEvent.location
                },
                registrations,
                total: registrations.length
            }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});