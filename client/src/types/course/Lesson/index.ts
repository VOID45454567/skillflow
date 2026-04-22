import type { Course } from ".."

export interface Lesson {
    id: number,
    title: string
    course: Course
    courseId: number
    order: number
    requredTime: number

    goals: string[]
    content: LessonContent
}

export interface LessonContent {
    sections: ContentSection[];
}

export interface ContentSection {
    id: string;
    type: 'text' | 'media' | 'code';
    [key: string]: any;
}

export interface TextSection extends ContentSection {
    type: 'text';
    format: 'html' | 'markdown' | 'plain';
    content: string;
    annotations?: string[];
}

export interface MediaSection extends ContentSection {
    type: 'media';
    url: string;
    altText?: string;
    caption?: string;
    width?: number;
    height?: number;
}

export interface CodeSection extends ContentSection {
    type: 'code';
    language: string;
    code: string;
    description?: string;
    executable?: boolean;
    editable?: boolean;
    output?: string;
    testCases?: Array<{ input: string; expected: any }>;
    hints?: string[];
}