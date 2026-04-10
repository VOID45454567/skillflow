import { Injectable, Inject, OnModuleInit, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as path from 'path';
import { Client } from 'minio';
import { NestMinioService } from 'nestjs-minio';
import { MediaType, UploadOptions, UploadResult } from './entities';
import { Multer } from 'multer'

@Injectable()
export class MinioService implements OnModuleInit {
    private readonly bucketName: string;
    private readonly publicUrl: string;
    private readonly isPublic: boolean;

    constructor(
        private readonly minio: NestMinioService,
        private readonly configService: ConfigService,
    ) {
        this.bucketName = configService.getOrThrow('S3_BUCKET_NAME');
        this.publicUrl = configService.getOrThrow('S3_PUBLIC_URL');
        this.isPublic = configService.get('S3_IS_PUBLIC') === 'true';
    }

    async onModuleInit() {
        await this.ensureBucketExists();
    }



    private async ensureBucketExists() {
        try {
            const exists = await this.getClient().bucketExists(this.bucketName);
            if (!exists) {
                await this.getClient().makeBucket(this.bucketName);
                console.log(`Bucket ${this.bucketName} created`);
            }
        } catch (error) {
            console.error('Failed to initialize bucket:', error);
        }
    }

    private getClient(): Client {
        return this.minio.getMinio();
    }

    async uploadAvatar(userId: number, file: Express.Multer.File): Promise<UploadResult> {
        this.validateImage(file);
        const folder = this.buildPath(MediaType.AVATAR, { userId });

        const existingAvatars = await this.listFiles(folder);

        if (existingAvatars.length > 0) {
            await this.deleteMultiple(existingAvatars);
        }

        const fileExtension = path.extname(file.originalname);
        const fileName = `avatar${fileExtension}`;
        const fullPath = `${folder}/${fileName}`;

        await this.getClient().putObject(
            this.bucketName,
            fullPath,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype }
        );

        const url = this.isPublic
            ? this.getPublicUrl(fullPath)
            : await this.getPresignedUrl(fullPath);

        return { fileName: fullPath, url };
    }



    async uploadLessonContent(lessonId: number, files: Express.Multer.File[]): Promise<UploadResult[]> {
        const folder = this.buildPath(MediaType.LESSON_CONTENT, { lessonId });
        const uploadPromises = files.map(file =>
            this.uploadFile(file, {
                folder,
                preserveOriginalName: true,
            })
        );
        return Promise.all(uploadPromises);
    }



    async uploadOrganizationLogo(organizationId: number, file: Express.Multer.File): Promise<UploadResult> {
        this.validateImage(file);
        const folder = this.buildPath(MediaType.ORGANIZATION_LOGO, { organizationId });

        const existingAvatars = await this.listFiles(folder);

        if (existingAvatars.length > 0) {
            await this.deleteMultiple(existingAvatars);
        }

        const fileExtension = path.extname(file.originalname);
        const fileName = `organization${fileExtension}`;
        const fullPath = `${folder}/${fileName}`;

        await this.getClient().putObject(
            this.bucketName,
            fullPath,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype }
        );

        const url = this.isPublic
            ? this.getPublicUrl(fullPath)
            : await this.getPresignedUrl(fullPath);

        return { fileName: fullPath, url };
    }

    async uploadOrganizationGallery(organizationId: number, files: Express.Multer.File[]): Promise<UploadResult[]> {
        const folder = this.buildPath(MediaType.ORGANIZATION_GALLERY, { organizationId });
        const uploadPromises = files.map(file =>
            this.uploadFile(file, {
                folder,
                generateUniqueName: true,
                maxSize: 10 * 1024 * 1024,
            })
        );
        return Promise.all(uploadPromises);
    }



    private async uploadFile(file: Express.Multer.File, options: UploadOptions): Promise<UploadResult> {
        this.validateFile(file, options);

        let fileName: string;
        if (options.preserveOriginalName) {
            fileName = this.sanitizeFileName(file.originalname);
        } else if (options.generateUniqueName) {
            const hash = crypto.randomBytes(16).toString('hex');
            const ext = path.extname(file.originalname);
            fileName = `${hash}${ext}`;
        } else {
            fileName = `${Date.now()}-${this.sanitizeFileName(file.originalname)}`;
        }

        const fullPath = `${options.folder}/${fileName}`;

        await this.getClient().putObject(
            this.bucketName,
            fullPath,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype }
        );

        const url = this.isPublic
            ? this.getPublicUrl(fullPath)
            : await this.getPresignedUrl(fullPath);

        return { fileName: fullPath, url };
    }

    async getAccessUrl(fileName: string, expiry: number = 3600): Promise<string> {
        if (this.isPublic) {
            return this.getPublicUrl(fileName);
        } else {
            return await this.getPresignedUrl(fileName, expiry);
        }
    }

    async getPresignedUrl(fileName: string, expiry: number = 3600): Promise<string> {
        return await this.getClient().presignedGetObject(
            this.bucketName,
            fileName,
            expiry
        );
    }

    getPublicUrl(fileName: string): string {
        const baseUrl = this.publicUrl.replace(/\/$/, '');
        const cleanFileName = fileName.replace(/^\//, '');
        return `${baseUrl}/${cleanFileName}`;
    }

    async deleteFile(fileName: string): Promise<void> {
        await this.getClient().removeObject(this.bucketName, fileName);
    }

    async deleteMultiple(fileNames: string[]): Promise<void> {
        if (fileNames.length === 0) return;
        await this.getClient().removeObjects(this.bucketName, fileNames);
    }

    async deleteFolder(folder: string): Promise<void> {
        const files = await this.listFiles(folder);
        await this.deleteMultiple(files);
    }

    async listFiles(prefix: string = ''): Promise<string[]> {
        const objectsStream = this.getClient().listObjects(this.bucketName, prefix, true);

        return new Promise((resolve, reject) => {
            const files: string[] = [];
            objectsStream.on('data', (obj) => files.push(obj.name!));
            objectsStream.on('end', () => resolve(files));
            objectsStream.on('error', reject);
        });
    }

    async fileExists(fileName: string): Promise<boolean> {
        try {
            await this.getClient().statObject(this.bucketName, fileName);
            return true;
        } catch {
            return false;
        }
    }

    async getFileSize(fileName: string): Promise<number> {
        const stat = await this.getClient().statObject(this.bucketName, fileName);
        return stat.size;
    }





    private validateFile(file: Express.Multer.File, options: UploadOptions) {
        if (options.maxSize && file.size > options.maxSize) {
            throw new BadRequestException(
                `Файл слишком большой. Максимальный размер: ${options.maxSize / 1024 / 1024}MB`
            );
        }

        if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `Неподдерживаемый тип файла. Разрешены: ${options.allowedTypes.join(', ')}`
            );
        }
    }

    private validateImage(file: Express.Multer.File) {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedImageTypes.includes(file.mimetype)) {
            throw new BadRequestException('Файл должен быть изображением');
        }
    }

    private sanitizeFileName(fileName: string): string {
        return fileName
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/\s+/g, '_')
            .toLowerCase();
    }

    private buildPath(type: MediaType, params: any): string {
        switch (type) {
            case MediaType.AVATAR:
                return `avatars/user_${params.userId}`;

            case MediaType.LESSON_CONTENT:
                return `lessons/lesson_${params.lessonId}/content`;


            case MediaType.ORGANIZATION_LOGO:
                return `organizations/org_${params.organizationId}/logo`;

            case MediaType.ORGANIZATION_GALLERY:
                return `organizations/org_${params.organizationId}/gallery`;


            default:
                throw new BadRequestException('Unknown media type');
        }
    }
}