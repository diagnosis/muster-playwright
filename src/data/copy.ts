// src/data/copy.ts


export const EMAIL_EXISTS = "email already registered"
export const SHORT_PASSWORD = "Password must be at least 8 characters"
export const INVALID_PASSWORD = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
export const VALIDATION_FAILED = "validation failed"

export const VERIFY_SUCCESS = "Your email is verified."
export const VERIFY_EXPIRED_OR_USED = 'This link has expired or was already used.'
export const VERIFY_INVALID = 'This link is not valid.'

export const INVALID_CREDENTIALS = 'invalid login credentials'
export const VERIFY_EMAIL = 'email needs to be verified.'
export const RESEND_VERIFICATION_STATUS = "If email provided matches our record, you will receive a verification email"


export const RESET_EMAIL_TEXT = 'If email provided matches our record, you will receive a password reset email shortly.'
export const PASS_CHANGE_SUCCESS = 'Password was changed successfully!'
export const INVALID_TOKEN = "This reset link is invalid or has expired."

export const WEAK_PASSWORDS =
    [
        {name:"short", password:"Sh0rt", message:SHORT_PASSWORD},
        {name:"weak", password:"WeakPassword", message:INVALID_PASSWORD}
    ]


export const SLOT_MESSAGE = {
    requested: 'Requested — waiting on host',
} as const

export const SLOT_FULL_WARNING = "⚠️This outing is full — you can still request in case a spot opens."


