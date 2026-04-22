import { UserVerificationStatuses } from "@/types/enums/verification-statuses";

export const mapVerificationStatus = (status: UserVerificationStatuses): { status: string; buttonText: string } => {
    const statusMap: Record<UserVerificationStatuses, { status: string; buttonText: string }> = {
        [UserVerificationStatuses.PENDING]: { status: 'На рассмотрении', buttonText: 'Ожидает' },
        [UserVerificationStatuses.REJECTED]: { status: 'Отклонено', buttonText: 'Повторить' },
        [UserVerificationStatuses.UNVERIFIED]: { status: 'Не верифицирован', buttonText: 'Пройти верификацию' },
        [UserVerificationStatuses.VERIFIED]: { status: 'Верифицирован', buttonText: 'Верифицирован' }
    }

    return statusMap[status] || { status: 'Неизвестно', buttonText: 'Проверить' }
}