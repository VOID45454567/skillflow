import type { UserVerificationStatuses } from "@/types/enums/verification-statuses";
import type { Axios } from "axios";
import { ENDPOINTS } from "../endpoints";
import type { User } from "@/types/user";
import type { Transaction } from "@/types/transaction";
import type { Payment } from "@/types/payment";
import type { CourseTerm, Term } from "@/types/course/course-term";
import type { AdminAction } from "@/types/adminAction";
import type { Appeal } from "@/types/appeal";
import type { AdminActionTypes } from "@/types/enums/admin-action-types";
import type { CreateTermDto } from "@/types/enums/common-info";

export interface SetVerificationStatusDto {
    status: UserVerificationStatuses;
    reason?: string;
}

export class AdminApi {
    constructor(private axios: Axios) { }

    async getAllUsers(): Promise<User[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getAllUsers);
        return request.data;
    }

    async getUsersOnVerification(): Promise<User[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getUsersOnVerification);
        return request.data;
    }

    async getAllTransactions(): Promise<Transaction[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getAllTransactions);
        return request.data;
    }

    async getAllPayments(): Promise<Payment[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getAllPayments);
        return request.data;
    }

    async getAllTerms(): Promise<CourseTerm[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getAllTerms);
        return request.data;
    }

    async getLogs(): Promise<AdminAction[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getLogs);
        return request.data;
    }

    async blockUser(id: number, reason: string): Promise<any> {
        const request = await this.axios.patch(ENDPOINTS.admin.blockUser(id), { reason });
        return request.data;
    }

    async unblockUser(id: number, reason: string): Promise<any> {
        const request = await this.axios.patch(ENDPOINTS.admin.unblockUser(id), { reason });
        return request.data;
    }

    async setVerificationStatus(id: number, newStatus: UserVerificationStatuses, reason: string, actionType: AdminActionTypes): Promise<any> {
        console.log(actionType);

        const request = await this.axios.patch(
            ENDPOINTS.admin.setVerificationStatus(id),
            {
                newStatus,
                reason,
                actionType
            }
        );
        return request.data;
    }

    async getUserPayments(userId: number): Promise<Payment[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getUserPayments(userId));
        return request.data;
    }

    async getUserTransactions(userId: number): Promise<Transaction[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getUserTransactions(userId));
        return request.data;
    }

    async getAppeals(): Promise<Appeal[]> {
        const request = await this.axios.get(ENDPOINTS.admin.getAppeals);
        console.log(request.data);
        return request.data;
    }

    async getAppeal(id: number): Promise<Appeal> {
        const request = await this.axios.get(ENDPOINTS.admin.getAppeal(id));
        return request.data;
    }

    async getAppealByUserId(userId: number): Promise<Appeal> {
        const request = await this.axios.get(ENDPOINTS.admin.getAppealByUserId(userId));
        return request.data;
    }
    async createTerm(dto: CreateTermDto) {
        const request = await this.axios.post(ENDPOINTS.admin.createTerm, dto)
        return request.data as CourseTerm
    }

    async updateTerm(dto: Pick<CreateTermDto, 'name'>, id: number) {
        const request = await this.axios.patch(ENDPOINTS.admin.deleteTerm(id), dto)
        return request
    }

    async deleteTerm(id: number) {
        const request = await this.axios.delete(ENDPOINTS.admin.deleteTerm(id))
        return request
    }
}