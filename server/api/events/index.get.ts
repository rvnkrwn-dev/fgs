// ========================================
// GET ALL EVENTS API
// ========================================
// File: ~/server/api/events/index.get.ts

import { EventModel } from "~/server/model/eventModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);

        const params = {
            page: query.page ? parseInt(query.page as string) : 1,
            limit: query.limit ? parseInt(query.limit as string) : 10,
            status: query.status as any,
            search: query.search as string,
            creator_id: query.creator_id as string
        };

        const result = await EventModel.getAllEvents(params);

        return {
            statusCode: 200,
            message: 'Data events berhasil diambil',
            data: result
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});