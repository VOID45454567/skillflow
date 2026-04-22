import { adminEndpoints } from "./admin";
import { authEndpoints } from "./auth";
import { coursesEdpoints } from "./course";
import { organizationEndpoints } from "./organizations";
import { termsEndpoints } from "./terms";
import { userEndpoints } from "./user";
import { userProgressEndpoints } from "./user-course-progress";

export const ENDPOINTS = {
    auth: authEndpoints,
    courses: coursesEdpoints,
    terms: termsEndpoints,
    user: userEndpoints,
    admin: adminEndpoints,
    userCourseProgress: userProgressEndpoints,
    organization: organizationEndpoints
}