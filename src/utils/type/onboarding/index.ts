export interface AuthPayload {
     email: string
     password: string
}

interface AuthErrorProps {
     type: string
}

export interface AuthResponseErrorProps {
     data: any
     error: AuthErrorProps
     message: string
     request_id: string
     status: number
}

interface AuthDataProps {
     token: string
}

export interface AuthResponseProps {
     data: AuthDataProps
}

export interface RegisterPayload {
     email: string
     password: string
     confirm_password: string
}

export interface OtpPayload {
     email: string
     otp_code: string
}

export interface SingleEmailPayload {
     email: string
}

export interface RenewPasswordPayload {
     user_id: any,
     unique_code: any,
     password: any,
     confirm_password: any,
}

export interface VerifyPasswordPayload {
     user_id: any,
     unique_code: any,
}

