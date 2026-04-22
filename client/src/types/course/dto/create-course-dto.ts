export type BlockType = 'text' | 'objectives' | 'code' | 'media';

export interface ContentBlock {
    id: string;
    type: BlockType;
    content: any;
}

export interface Lesson {
    id: string;
    title: string;
    goals: string[];
    order: number;
    contentBlocks: ContentBlock[];
}

export interface Module {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: Lesson[];
}

export interface CourseFormData {
    title: string;
    description: string;
    termIds: number[];
    visibility: 'PUBLIC' | 'ORGANIZATION' | 'DRAFT';
    isFree: boolean;
    price?: number;
    modules: Module[];
}