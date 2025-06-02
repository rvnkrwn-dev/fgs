// ========================================
// UPDATE REGISTRATION API
// ========================================
// File: ~/server/api/registrations/[id].put.ts

import { EventRegistrationModel } from "~/server/model/eventRegistrationModel";
import { errorHandlingTransform } from "~/server/utils/errorHandlingUtils";

export default defineEventHandler(async (event) => {
    try {
        const registrationId = getRouterParam(event, 'id');
        const body = await readBody(event);

        if (!registrationId) {
            setResponseStatus(event, 400);
            return { statusCode: 400, message: 'Registration ID diperlukan' };
        }

        // Check if registration exists
        const existingRegistration = await EventRegistrationModel.getRegistrationById(registrationId);
        if (!existingRegistration) {
            setResponseStatus(event, 404);
            return { statusCode: 404, message: 'Registrasi tidak ditemukan' };
        }

        // Prepare update data
        const updateData: any = {};

        if (body.full_name) updateData.full_name = body.full_name.trim();
        if (body.whatsapp) {
            // Validate WhatsApp format
            const whatsappRegex = /^(\+62|62)[0-9]{8,13}$/;
            const cleanWhatsapp = body.whatsapp.replace(/\s/g, '');

            if (!whatsappRegex.test(cleanWhatsapp)) {
                setResponseStatus(event, 400);
                return { statusCode: 400, message: 'Format WhatsApp tidak valid' };
            }

            // Check if new WhatsApp already registered (except current registration)
            const isRegistered = await EventRegistrationModel.isWhatsAppRegistered(
                existingRegistration.event_id,
                cleanWhatsapp
            );

            if (isRegistered && cleanWhatsapp !== existingRegistration.whatsapp) {
                setResponseStatus(event, 409);
                return { statusCode: 409, message: 'Nomor WhatsApp sudah terdaftar untuk event ini' };
            }

            updateData.whatsapp = cleanWhatsapp;
        }
        if (body.province) updateData.province = body.province.trim();
        if (body.city) updateData.city = body.city.trim();
        if (body.district) updateData.district = body.district.trim();
        if (body.postal_code) {
            if (!/^\d{5}$/.test(body.postal_code)) {
                setResponseStatus(event, 400);
                return { statusCode: 400, message: 'Kode pos harus 5 digit angka' };
            }
            updateData.postal_code = body.postal_code.trim();
        }

        const updatedRegistration = await EventRegistrationModel.updateRegistration(registrationId, updateData);

        return {
            statusCode: 200,
            message: 'Registrasi berhasil diperbarui!',
            data: { registration: updatedRegistration }
        };

    } catch (error: any) {
        const { statusCode, message } = errorHandlingTransform(error);
        setResponseStatus(event, statusCode);
        return { statusCode, message };
    }
});