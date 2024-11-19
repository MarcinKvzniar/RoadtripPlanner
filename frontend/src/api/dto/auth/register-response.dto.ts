export class RegisterResponseDto {
  token!: string;
  refreshToken!: string;
  username: string | undefined;
  role: string | undefined;
  userId: string | undefined;
  message: string | undefined;
}
