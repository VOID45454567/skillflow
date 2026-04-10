
export enum MediaType {
    AVATAR = 'avatar',
    LESSON_CONTENT = 'lesson_content',
    ORGANIZATION_LOGO = 'organization_logo',
    ORGANIZATION_GALLERY = 'organization_gallery',
}

export interface UploadOptions {
    folder: string;
    maxSize?: number;
    allowedTypes?: string[];
    generateUniqueName?: boolean;
    preserveOriginalName?: boolean;
}

export interface UploadResult {
    fileName: string;
    url: string;
}