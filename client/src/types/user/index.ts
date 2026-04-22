import type { Appeal } from "../appeal";
import type { BlockInfo } from "../blockInfo";
import type { Course } from "../course";
import type { UserRoles } from "../enums/roles";
import type { UserVerificationStatuses } from "../enums/verification-statuses";
import type { Payment } from "../payment";
import type { Review } from "../review";
import type { Transaction } from "../transaction";
import type { UserCourseProgress } from "../userCourseProgress";
import type { Heatmap } from "./heatmap";

export interface User {
    id: number,
    login: string,
    email: string,
    password: string,
    avatarUrl: string,
    balance: number,
    enabledTwoFactor: boolean,
    role: UserRoles,
    verificationStatus: UserVerificationStatuses,
    courses: Course[]
    createdAt: string,
    updatedAt: string
    userCourseProgresses: UserCourseProgress[]
    purchasedCourses: Course[]
    transactions: Transaction[]
    bannedByUsers: BlockInfo[]
    reviews: Review[]
    payments: Payment[]
    heatmapDatas: Heatmap[],
    appeals: Appeal[]
    _count: any
}