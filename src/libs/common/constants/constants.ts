export const CREATED_AT_COLUMN = 'createdAt';

export enum InjectionTokens {
  EMAIL_CLIENT = 'EMAIL_CLIENT',
  DELIVERY_SERVICE = 'DELIVERY_SERVICE',
  SMS_CLIENT = 'SMS_CLIENT',
}

export enum NotificationType {
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export enum OtpType {
  SIGNUP = 'signup',
  WITHDRAWAL = 'withdrawal',
  BANK_UPDATE = 'bank_update',
  RESET_PASSWORD = 'reset-password',
}

export const DEFAULT_OTP_DEV = '12345';

export const Events = {
  NOTIFICATIONS: {
    [NotificationType.RESET_PASSWORD]: NotificationType.RESET_PASSWORD,
  },
};