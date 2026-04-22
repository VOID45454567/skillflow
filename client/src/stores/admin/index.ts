// stores/admin.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { API } from "@/api";
import type { User } from "@/types/user";
import type { Transaction } from "@/types/transaction";
import type { Payment } from "@/types/payment";
import type { CourseTerm } from "@/types/course/course-term";
import type { AdminAction } from "@/types/adminAction";
import type { UserVerificationStatuses } from "@/types/enums/verification-statuses";
import type { Appeal } from "@/types/appeal";
import type { AdminActionTypes } from "@/types/enums/admin-action-types";

export const useAdminStore = defineStore("admin", () => {
    // State
    const users = ref<User[]>([]);
    const pendingVerificationUsers = ref<User[]>([]);
    const transactions = ref<Transaction[]>([]);
    const payments = ref<Payment[]>([]);
    const terms = ref<CourseTerm[]>([]);
    const logs = ref<AdminAction[]>([]);
    const appeals = ref<Appeal[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const blockedUsers = computed(() =>
        users.value.filter(u => u.bannedByUsers?.length > 0)
    );

    const verifiedUsers = computed(() =>
        users.value.filter(u => u.verificationStatus === "VERIFIED")
    );

    const totalBalance = computed(() =>
        payments.value.reduce((sum, p) => sum + p.count, 0)
    );

    const totalTransactions = computed(() =>
        transactions.value.length
    );

    // Actions
    async function fetchAllUsers() {
        loading.value = true;
        try {
            users.value = await API.admin.getAllUsers();
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchPendingVerifications() {
        loading.value = true;
        try {
            pendingVerificationUsers.value = await API.admin.getUsersOnVerification();
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchAllTransactions() {
        loading.value = true;
        try {
            transactions.value = await API.admin.getAllTransactions();
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchAllPayments() {
        loading.value = true;
        try {
            payments.value = await API.admin.getAllPayments();
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchAllTerms() {
        loading.value = true;
        try {
            terms.value = await API.admin.getAllTerms();
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchLogs() {
        loading.value = true;
        try {
            logs.value = await API.admin.getLogs();
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchAppeals() {
        loading.value = true;
        try {
            appeals.value = await API.admin.getAppeals();
            console.log(appeals.value);

        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function getAppealDetails(appealId: number) {
        try {
            return await API.admin.getAppeal(appealId);
        } catch (err: any) {
            error.value = err.message;
            return null;
        }
    }

    async function blockUser(userId: number, reason: string) {
        try {
            await API.admin.blockUser(userId, reason);
            await fetchAllUsers();
            await fetchLogs();
            return true;
        } catch (err: any) {
            error.value = err.message;
            return false;
        }
    }

    async function unblockUser(userId: number, reason: string) {
        try {
            await API.admin.unblockUser(userId, reason);
            await fetchAllUsers();
            await fetchLogs();
            return true;
        } catch (err: any) {
            error.value = err.message;
            return false;
        }
    }

    async function setVerificationStatus(userId: number, status: UserVerificationStatuses, reason: string, actionType: AdminActionTypes) {
        try {
            await API.admin.setVerificationStatus(userId, status, reason, actionType);
            await Promise.all([fetchAllUsers(), fetchPendingVerifications()]);
            await fetchLogs();
            return true;
        } catch (err: any) {
            error.value = err.message;
            return false;
        }
    }

    async function fetchUserPayments(userId: number): Promise<Payment[]> {
        try {
            return await API.admin.getUserPayments(userId);
        } catch (err: any) {
            error.value = err.message;
            return [];
        }
    }

    async function fetchUserTransactions(userId: number): Promise<Transaction[]> {
        try {
            return await API.admin.getUserTransactions(userId);
        } catch (err: any) {
            error.value = err.message;
            return [];
        }
    }

    async function fetchAllData() {
        loading.value = true;
        try {
            await Promise.all([
                fetchAllUsers(),
                fetchPendingVerifications(),
                fetchAllTransactions(),
                fetchAllPayments(),
                fetchAllTerms(),
                fetchLogs(),
                fetchAppeals()
            ]);
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    function clearError() {
        error.value = null;
    }

    return {
        // State
        users,
        pendingVerificationUsers,
        transactions,
        payments,
        terms,
        logs,
        loading,
        error, appeals,


        // Getters
        blockedUsers,
        verifiedUsers,
        totalBalance,
        totalTransactions,

        // Actions
        fetchAllUsers,
        fetchPendingVerifications,
        fetchAllTransactions,
        fetchAllPayments,
        fetchAllTerms,
        fetchLogs,
        blockUser,
        unblockUser,
        setVerificationStatus,
        fetchUserPayments,
        fetchUserTransactions,
        fetchAllData,
        clearError,
        fetchAppeals,
        getAppealDetails,
    };
});