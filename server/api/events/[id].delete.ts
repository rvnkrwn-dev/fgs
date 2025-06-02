// ========================================
// DELETE EVENT BY ID API
// ========================================
// File: ~/server/api/events/[id].delete.ts

import { EventModel } from "~/server/model/eventModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";
import { join } from 'path';
import { deleteFile } from "~/server/utils/fileUtils";

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

        // Delete banner file if exists
        if (existingEvent.banner_url) {
            try {
                const bannerPath = join(process.cwd(), 'public', existingEvent.banner_url);
                await deleteFile(bannerPath);
            } catch (fileError) {
                console.warn('Failed to delete banner file:', fileError);
            }
        }

        // Delete cover file if exists
        if (existingEvent.cover_url) {
            try {
                const coverPath = join(process.cwd(), 'public', existingEvent.cover_url);
                await deleteFile(coverPath);
            } catch (fileError) {
                console.warn('Failed to delete cover file:', fileError);
            }
        }

        // Delete event from database
        await EventModel.deleteEvent(eventId);

        return {
            statusCode: 200,
            message: 'Event berhasil dihapus!'
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});