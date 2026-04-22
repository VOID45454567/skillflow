import { API } from "@/api";
import type { Organization } from "@/types/Organization";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrganizationStore = defineStore('organization', () => {
    const currentOrg = ref<Organization | undefined>(undefined)
    const allOrgs = ref<Organization[]>([])

    const setCurrentOrg = (org: Organization) => {
        currentOrg.value = org
    }

    const getOrgById = async (id: number): Promise<Organization> => {
        return await API.organization.getById(id)
    }

    const getAll = async () => {
        const responce = await API.organization.getAll()
        allOrgs.value = responce
    }

    const addMember = async (orgId: number, userId: number) => {
        const result = await API.organization.addMember(orgId, userId)
    }

    const removeMember = async (orgId: number, userId: number) => {
        const result = await API.organization.removeMember(orgId, userId)
    }

    const sendInviteCode = async (userId: number, orgId: number) => {
        const result = await API.organization.sendInviteCode(userId, orgId)
    }

    const create = async (name: string, description: string) => {
        const result = await API.organization.create(name, description)
    }

    const uploadLogo = async (orgId: number, file: File) => {
        const result = await API.organization.uploadLogo(orgId, file)
    }

    const uploadGallery = async (orgId: number, files: File[]) => {
        const result = await API.organization.uploadGallery(orgId, files)
    }

    const removeFromGallery = async (orgId: number, filename: string) => {
        const respult = await API.organization.removeFromGallery(orgId, filename)
    }

    return {
        currentOrg,
        allOrgs,

        getOrgById,
        setCurrentOrg,
        getAll,
        addMember,
        removeMember,
        removeFromGallery,
        uploadGallery,
        uploadLogo,
        create,
        sendInviteCode,
    }
})