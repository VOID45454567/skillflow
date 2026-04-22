import { CourseLevels } from "@/types/enums/course-levels";
import { Crown, Sparkles, TrendingUp, Zap } from "@lucide/vue";

export const mapCourseLevel = (level: string): string => {
    const labels: Record<string, string> = {
        'BEGINNER': 'Начинающий',
        'INTERMEDIATE': 'Средний',
        'ADVANCED': 'Продвинутый',
        'PROFESSIONAL': 'Профессиональный',
    };
    return labels[level] || level;
};

export const getLevelIcon = (level: string) => {
    const icons: Record<string, any> = {
        'BEGINNER': Sparkles,
        'INTERMEDIATE': Zap,
        'ADVANCED': TrendingUp,
        'PROFESSIONAL': Crown,
    };
    return icons[level] || Sparkles;
};

export const getLevelColors = (level: string) => {
    const colors: Record<string, { from: string; to: string }> = {
        'BEGINNER': { from: "#6366f1", to: "#a78bfa" },
        'INTERMEDIATE': { from: "#4f46e5", to: "#f472b6" },
        'ADVANCED': { from: "#7c3aed", to: "#ec4899" },
        'PROFESSIONAL': { from: "#1e1b4b", to: "#be123c" },
    };
    return colors[level] || colors['BEGINNER'];
};