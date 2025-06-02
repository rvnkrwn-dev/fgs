// ========================================
// GET ALL REGISTRATIONS API
// ========================================
// File: ~/server/api/registrations/index.get.ts

import { EventRegistrationModel } from "~/server/model/eventRegistrationModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);

        const params = {
            page: query.page ? parseInt(query.page as string) : 1,
            limit: query.limit ? parseInt(query.limit as string) : 10,
            event_id: query.event_id as string,
            search: query.search as string,
            province: query.province as string,
            city: query.city as string
        };

        const result = await EventRegistrationModel.getAllRegistrations(params);

        return {
            statusCode: 200,
            message: 'Data registrasi berhasil diambil',
            data: result
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});