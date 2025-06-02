import {v4 as uuidv4} from "uuid";
import {join} from "path";
import {mkdir, unlink, writeFile} from "fs/promises";

export const fileUtils = async (file: File): Promise<string> => {
    if (!file) return '';

    // Validasi file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Format file harus JPG, JPEG, atau PNG');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('Ukuran file maksimal 5MB');
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, fileName);

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return `/uploads/${fileName}`;
};

export const deleteFile = async (filePath: string) => {
    try {
        const fullPath = join(process.cwd(), 'public', filePath);
        await unlink(fullPath);
        return 'Successfully deleted file';
    } catch (error) {
        return 'Failed to delete file: '+error
    }
};

export const validateImageFile = (file: File): { isValid: boolean; message?: string } => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, message: 'Format file harus JPG, JPEG, atau PNG' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return { isValid: false, message: 'Ukuran file maksimal 5MB' };
    }

    return { isValid: true };
};