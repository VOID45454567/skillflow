import { AdminApi } from "./admin";
import { authApi } from "./auth";
import { axiosApp } from "./client";
import { coursesApi } from "./course";
import { OrganizationApi } from "./organization";
import { termsApi } from "./term";
import { userApi } from "./user";
import { userProgressApi } from "./userCourseProgress";

export const API = {
    auth: new authApi(axiosApp),
    courses: new coursesApi(axiosApp),
    terms: new termsApi(axiosApp),
    users: new userApi(axiosApp),
    admin: new AdminApi(axiosApp),
    userProgress: new userProgressApi(axiosApp),
    organization: new OrganizationApi(axiosApp)
}