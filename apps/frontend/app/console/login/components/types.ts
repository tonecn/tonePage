export type SubmitMode = 'password' | 'phone' | 'email';
export type LoginFormData = {
  type: SubmitMode;
  account?: string;
  password?: string;
  phone?: string;
  email?: string;
  code?: string;
}

export type SendCodeMode = 'phone' | 'email';
export type SendCodeFormData = {
  type: SendCodeMode;
  phone?: string;
  email?: string;
}