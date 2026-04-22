import type { Course } from "../course";
import type { User } from "../user";
import type { OrganizationMemder } from "./OrganizationMember";

export interface Organization {
    id: number,
    name: string,
    description: string,
    logo: string
    images: string[]
    owner: User,
    userId: number,
    inviteCode: string
    courses: Course[]
    organizationMembers: OrganizationMemder[]
    createdAt: string
}