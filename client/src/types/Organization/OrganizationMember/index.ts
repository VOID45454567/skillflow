import type { User } from "@/types/user";
import type { Organization } from "..";

export interface OrganizationMemder {
    userId: number,
    user: User
    organization: Organization
    organizationId: number
    joinedAt: string
}