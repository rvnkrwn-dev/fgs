import { EventRegistrationModel } from "~/server/model/eventRegistrationModel";
import { EventModel } from "~/server/model/eventModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

const validateRegistrationInput = (data: any) => {
    const requiredFields = ['event_id', 'full_name', 'whatsapp', 'province', 'city', 'district', 'postal_code'];

    for (const field of requiredFields) {
        if (!data[field]?.trim()) {
            return { isValid: false, message: `Field ${field} wajib diisi` };
        }
    }

    // Validate WhatsApp format (starts with 62 or +62)
    const whatsappRegex = /^(\+62|62)[0-9]{8,13}$/;
    if (!whatsappRegex.test(data.whatsapp.replace(/\s/g, ''))) {
        return { isValid: false, message: 'Format WhatsApp tidak valid (gunakan format: 628xxxxxxxxx)' };
    }

    // Validate postal code (5 digits)
    if (!/^\d{5}$/.test(data.postal_code)) {
        return { isValid: false, message: 'Kode pos harus 5 digit angka' };
    }

    return { isValid: true };
};

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        // Validate input
        const inputValidation = validateRegistrationInput(body);
        if (!inputValidation.isValid) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: inputValidation.message };
        }

        // Check if event exists and is published
        const existingEvent = await EventModel.getEventById(body.event_id);
        if (!existingEvent) {
            setResponseStatus(event, 404);
            return { statusCode: 404, message: 'Event tidak ditemukan' };
        }

        if (existingEvent.status !== 'PUBLISHED') {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: 'Event belum dipublikasikan' };
        }

        // Check if event has already started
        if (new Date(existingEvent.start_date) < new Date()) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: 'Pendaftaran sudah ditutup, event telah dimulai' };
        }

        // Check if WhatsApp already registered
        const isRegistered = await EventRegistrationModel.isWhatsAppRegistered(
            body.event_id,
            body.whatsapp.replace(/\s/g, '')
        );

        if (isRegistered) {
            setResponseStatus(event, 409);
            return { statusCode: 409, message: 'Nomor WhatsApp sudah terdaftar untuk event ini' };
        }

        // Create registration
        const registration = await EventRegistrationModel.createRegistration({
            event_id: body.event_id,
            full_name: body.full_name.trim(),
            whatsapp: body.whatsapp.replace(/\s/g, ''),
            province: body.province.trim(),
            city: body.city.trim(),
            district: body.district.trim(),
            postal_code: body.postal_code.trim()
        });

        return {
            statusCode: 201,
            message: 'Pendaftaran berhasil!',
            data: { registration }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});