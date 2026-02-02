export class SignUp {
  tenantName: string = '';
  tenantCode: string = '';
  phoneNumber: string = '';
  password: string = '';
}

export class AuthRescue {
  identifier: string = '';
  purpose: string = '';
}

export class VerifyAuthRescue {
  identifier: string = '';
  purpose: string = '';
  token: string = '';
}

export class RequestForgotPassword {
  phoneNumber: string = '';
  redirectBaseUrl?: string = '';
}

export class RequestResetPassword {
  token: string = '';
  newPassword: string = '';
}

export interface UpdatePasswordUserRequest {
  oldPassword: string;
  password: string;
}
