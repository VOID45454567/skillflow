import type { Axios, AxiosError } from "axios";
import { ENDPOINTS } from "../endpoints";
import type { Organization } from "@/types/Organization";
import type { Course } from "@/types/course";

export interface UploadResult {
    url: string;
    filename: string;
}

export interface GalleryRemoveResponse {
    message: string;
    removedFile: string;
    remainingImages: number;
}

export class OrganizationApi {
    constructor(private axios: Axios) { }

    async getAll() {
        try {
            const request = await this.axios.get(ENDPOINTS.organization.getAll);
            return request.data as Organization[];
        } catch (error) {
            throw error as AxiosError;
        }
    }

    async getById(id: number) {
        try {
            const request = await this.axios.get(ENDPOINTS.organization.getById(id));
            console.log(request.data);

            return request.data as Organization;
        } catch (error) {
            throw error as AxiosError;
        }
    }

    async create(name: string, description: string) {
        try {
            const request = await this.axios.post(ENDPOINTS.organization.create, { name, description });
            return request.data as Organization;
        } catch (error) {
            throw error as AxiosError;
        }
    }

    // async update(id: number, dto: UpdateOrganizationDto) {
    //     try {
    //         const request = await this.axios.patch(
    //             ENDPOINTS.organization.update(id),
    //             dto
    //         );
    //         return request.data as Organization;
    //     } catch (error) {
    //         throw error as AxiosError;
    //     }
    // }

    async sendInviteCode(userId: number, orgId: number) {
        try {
            const request = await this.axios.post(
                ENDPOINTS.organization.invite,
                { userId, orgId }
            );
            return request.data as { message: string };
        } catch (error) {
            throw error as AxiosError;
        }
    }

    async uploadLogo(orgId: number, file: File) {
        try {
            const formData = new FormData();
            formData.append("logo", file);

            const request = await this.axios.post(
                ENDPOINTS.organization.uploadLogo(orgId),
                formData
            );
            return request.data as UploadResult;
        } catch (error) {
            throw error as AxiosError;
        }
    }

    async uploadGallery(orgId: number, files: File[]) {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            });

            const request = await this.axios.post(
                ENDPOINTS.organization.uploadGallery(orgId),
                formData,
            );
            return request.data as UploadResult[];
        } catch (error) {
            throw error as AxiosError;
        }
    }

    async removeFromGallery(orgId: number, filename: string) {
        try {
            const request = await this.axios.delete(
                ENDPOINTS.organization.removeFromGallery(orgId),
                {
                    data: { filename },
                }
            );
            return request.data as GalleryRemoveResponse;
        } catch (error) {
            throw error as AxiosError;
        }
    }

    async createCourse(orgId: number, dto: FormData) {
        try {
            const request = await this.axios.post(
                ENDPOINTS.organization.createCourseFromOrg(orgId),
                dto
            );
            return request.data as Course;
        } catch (error) {
            throw error as AxiosError;
        }
    }

    async addMember(orgId: number, userId: number) {
        try {
            const request = await this.axios.post(
                ENDPOINTS.organization.addmember(orgId),
                { userId }
            );
            return request.data;
        } catch (error) {
            throw error as AxiosError;
        }
    }

    async removeMember(orgId: number, userId: number) {
        try {
            const request = await this.axios.delete(
                ENDPOINTS.organization.removeMember(orgId),
                {
                    data: { userId },
                }
            );
            return request.data;
        } catch (error) {
            throw error as AxiosError;
        }
    }
}