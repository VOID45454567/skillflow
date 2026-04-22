import { UserRoles } from "@/types/enums/roles";
import AdminDashboard from "@/views/admin/AdminDashboard.vue";
import Appeal from "@/views/Appeal.vue";
import Login from "@/views/auth/Login.vue";
import Profile from "@/views/auth/Profile.vue";
import Register from "@/views/auth/Register.vue";
import TwoFactor from "@/views/auth/TwoFactor.vue";
import CourseLearningPage from "@/views/courses/CourseLearningPage.vue";
import CreateCourse from "@/views/courses/CreateCourse.vue";
import MyCourses from "@/views/courses/MyCourses.vue";
import PublicCourses from "@/views/courses/PublicCourses.vue";
import SingleCoursePage from "@/views/courses/SingleCoursePage.vue";
import Main from "@/views/Main.vue";
import OrganizationDashboard from "@/views/organizations/OrganizationDashboard.vue";
import OrganizationsPage from "@/views/organizations/OrganizationsPage.vue";
import SingleOrganizationPage from "@/views/organizations/SingleOrganizationPage.vue";
import Error from "@/views/utils/Error.vue";
import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
    { path: '/', name: 'home', component: Main },
    { path: '/register', name: 'register', component: Register },
    { path: '/login', name: 'login', component: Login },
    { path: '/profile', name: 'profile', component: Profile },
    { path: '/error', name: 'error', component: Error },
    { path: '/verify-2fa', name: 'verify-2fa', component: TwoFactor },
    { path: '/courses/public', name: 'public-courses', component: PublicCourses },
    { path: '/courses/create', name: 'create-course', component: CreateCourse, props: true },
    { path: '/courses/:id', name: 'single-course-page', component: SingleCoursePage },
    { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboard, meta: { roles: [UserRoles.ADMIN], requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', redirect: { name: 'error', query: { code: '404', message: 'Страница не найдена' } } },
    {
        path: '/error/:code?', name: 'error', component: Error, props: route => ({
            code: route.query.code,
            message: route.query.message
        })
    },
    { path: '/courses', name: "my-courses", component: MyCourses },
    { path: '/learning/:id', name: 'course-learning', component: CourseLearningPage },
    { path: '/organizations', name: 'organizations', component: OrganizationsPage },
    { path: '/organizations/:id', name: 'single-org', component: SingleOrganizationPage },
    { path: '/organizations/:id/dashboard', name: 'organization-dashboard', component: OrganizationDashboard },
    { path: '/send-appeal', name: 'send-appeal', component: Appeal }

]