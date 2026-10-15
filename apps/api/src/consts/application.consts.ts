export const APPLICATION_STATUS = {
    WISHLIST: 'wishlist',
    APPLIED: 'applied',
    INTERVIEW: 'interview',
    OFFER: 'offer',
    REJECTED: 'rejected'
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];
