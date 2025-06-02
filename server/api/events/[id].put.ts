// ========================================
// UPDATE EVENT BY ID API
// ========================================
// File: ~/server/api/events/[id].put.ts

import { EventModel } from "~/server/model/eventModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";
import { fileUtils } from "~/server/utils/fileUtils";

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

        const formData = await readMultipartFormData(event);

        if (!formData) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: 'Form data tidak valid' };
        }

        // Extract form fields
        const data: any = {};
        let bannerFile: File | null = null;
        let coverFile: File | null = null;

        for (const item of formData) {
            if (item.name === 'banner' && item.filename) {
                bannerFile = new File([item.data], item.filename, { type: item.type });
            } else if (item.name === 'cover' && item.filename) {
                coverFile = new File([item.data], item.filename, { type: item.type });
            } else if (item.name) {
                data[item.name] = item.data.toString();
            }
        }

        // Prepare update data
        const updateData: any = {};

        if (data.title) updateData.title = data.title.trim();
        if (data.description) updateData.description = data.description.trim();
        if (data.location) updateData.location = data.location.trim();
        if (data.status) updateData.status = data.status;

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            if (!isNaN(startDate.getTime())) {
                updateData.start_date = startDate;
            }
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            if (!isNaN(endDate.getTime())) {
                updateData.end_date = endDate;
            }
        }

        // Validate dates if both are provided
        if (updateData.start_date && updateData.end_date) {
            if (updateData.start_date >= updateData.end_date) {
                setResponseStatus(event, 400);
                return { statusCode: 400, message: 'Tanggal mulai harus sebelum tanggal selesai' };
            }
        }

        // Handle file uploads if new files are provided
        if (bannerFile) {
            updateData.banner_url = await fileUtils(bannerFile);
        }

        if (coverFile) {
            updateData.cover_url = await fileUtils(coverFile);
        }

        // Update event
        const updatedEvent = await EventModel.updateEvent(eventId, updateData);

        return {
            statusCode: 200,
            message: 'Event berhasil diperbarui!',
            data: { event: updatedEvent }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});