import { API } from "@/api";
import type { CourseTerm } from "@/types/course/course-term";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useTermStore = defineStore('terms', () => {
    const categories = ref<CourseTerm[]>([])
    const tags = ref<CourseTerm[]>([])
    const allTerms = ref<CourseTerm[]>([])

    watch(
        [categories, tags],
        ([newCategories, newTags]) => {
            allTerms.value = [...newTags, ...newCategories]
        },
        { immediate: true, deep: true }
    )

    const getCategories = async () => {
        categories.value = await API.terms.getCategories() || []

    }

    const getTags = async () => {
        tags.value = await API.terms.getTags() || []
    }

    return {
        categories,
        tags,
        allTerms,
        getTags,
        getCategories
    }
})