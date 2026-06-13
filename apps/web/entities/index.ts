export interface ResetPasswordPayload {
  email: string;
  code: string;
  password?: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}
