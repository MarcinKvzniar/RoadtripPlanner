export class LoginResponseDto {
  token!: string;
  refreshToken!: string;
  username: string | undefined;
  role: string | undefined;
}
