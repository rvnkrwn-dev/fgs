import {Prisma} from "@prisma/client";

export const errorHandlingTransform = (error: any) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002": // Unique constraint failed
                return {
                    statusCode: 400,
                    message: `Field '${error.meta?.target}' harus unik. Data duplikat ditemukan.`,
                };

            case "P2025": // Record not found
                return {
                    statusCode: 404,
                    message: "Data yang dicari tidak ditemukan.",
                };

            case "P2003": // Foreign key constraint failed
                return {
                    statusCode: 400,
                    message: `Relasi tidak valid. Properti '${error.meta?.target}' melanggar constraint foreign key.`,
                };

            case "P2014": // Nested connect failed
                return {
                    statusCode: 400,
                    message: `Kesalahan relasi nested: ${error.meta?.target}.`,
                };

            case "P2016": // Query interpretation error
                return {
                    statusCode: 500,
                    message: "Terjadi kesalahan dalam eksekusi query.",
                };

            default:
                return {
                    statusCode: 500,
                    message: "Kesalahan Prisma yang tidak dikenali.",
                };
        }
    }

    // Jika bukan Prisma error, kembalikan error server umum
    return {
        statusCode: 500,
        message: "Terjadi kesalahan pada server.",
    };
}