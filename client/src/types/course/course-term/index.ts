export type Term = 'TAG' | 'CATEGORY'

export interface CourseTerm {
    id: number
    type: Term,
    name: string
}