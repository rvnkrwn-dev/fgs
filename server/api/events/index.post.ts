// ========================================
// CREATE EVENT API
// ========================================
// File: ~/server/api/events/index.post.ts

import { EventModel } from "~/server/model/eventModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";
import { fileUtils } from "~/server/utils/fileUtils";

const validateEventInput = (data: any) => {
    const requiredFields = ['title', 'description', 'start_date', 'end_date', 'location'];

    for (const field of requiredFields) {
        if (!data[field]?.trim()) {
            return { isValid: false, message: `Field ${field} wajib diisi` };
        }
    }

    // Validasi tanggal
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { isValid: false, message: 'Format tanggal tidak valid' };
    }

    if (startDate >= endDate) {
        return { isValid: false, message: 'Tanggal mulai harus sebelum tanggal selesai' };
    }

    if (startDate < new Date()) {
        return { isValid: false, message: 'Tanggal mulai tidak boleh di masa lalu' };
    }

    return { isValid: true };
};

export default defineEventHandler(async (event) => {
    try {
        const {user} = event.context.auth
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

        // Validate input
        const inputValidation = validateEventInput(data);
        if (!inputValidation.isValid) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: inputValidation.message };
        }

        // Handle file uploads
        let bannerUrl = '';
        let coverUrl = '';

        if (bannerFile) {
            console.log(bannerFile)
            bannerUrl = await fileUtils(bannerFile);
        }

        if (coverFile) {
            console.log(coverFile)
            coverUrl = await fileUtils(coverFile);
        }

        // Create event
        const newEvent = await EventModel.createEvent({
            title: data.title.trim(),
            description: data.description.trim(),
            start_date: new Date(data.start_date),
            end_date: new Date(data.end_date),
            location: data.location.trim(),
            banner_url: bannerUrl,
            cover_url: coverUrl,
            status: data.status || 'DRAFT',
            creator_id: user.id
        });



        setResponseStatus(event, 201);
        return {
            statusCode: 201,
            message: 'Event berhasil dibuat!',
            data: { event: newEvent }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});