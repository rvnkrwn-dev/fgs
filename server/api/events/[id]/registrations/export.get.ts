// ========================================
// EXPORT EVENT REGISTRATIONS API
// ========================================
// File: ~/server/api/events/[id]/registrations/export.get.ts

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

        const registrations = await EventRegistrationModel.exportEventRegistrations(eventId);

        // Set headers for CSV download
        setHeader(event, 'Content-Type', 'text/csv');
        setHeader(event, 'Content-Disposition', `attachment; filename="registrations_${existingEvent.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv"`);

        // Create CSV content
        const headers = ['Nama Lengkap', 'WhatsApp', 'Provinsi', 'Kota', 'Kecamatan', 'Kode Pos', 'Tanggal Daftar'];
        const csvContent = [
            headers.join(','),
            ...registrations.map(reg => [
                `"${reg.full_name}"`,
                `"${reg.whatsapp}"`,
                `"${reg.province}"`,
                `"${reg.city}"`,
                `"${reg.district}"`,
                `"${reg.postal_code}"`,
                `"${new Date(reg.registered_at).toLocaleString('id-ID')}"`
            ].join(','))
        ].join('\n');

        return csvContent;

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});