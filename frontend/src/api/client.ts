import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoginRequestDto } from './dto/auth/login-request.dto';
import { LoginResponseDto } from './dto/auth/login-response.dto';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { RegisterRequestDto } from './dto/auth/register-request.dto';
import { RegisterResponseDto } from './dto/auth/register-response.dto';
import Cookies from 'universal-cookie';

type ClientResponse<T> = {
  success: boolean;
  data: T;
  status: number;
};

interface MyJwtPayLoad extends JwtPayload {
  role?: string;
}

export class Client {
  private client: AxiosInstance;
  private cookies = new Cookies();

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8080/api',
    });

    this.client.interceptors.request.use((config) => {
      const token = this.cookies.get('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          await this.refreshToken();

          return this.client(originalRequest);
        }

        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          await this.refreshToken();

          const originalRequest = error.config;
          return this.client(originalRequest);
        }

        throw error;
      }
    );
  }

  public isLoggedIn(): boolean {
    const token = this.cookies.get('token');
    return Boolean(token);
  }

  public getUserRole(): string {
    const token = this.cookies.get('token');
    if (token) {
      const decoded = jwtDecode<MyJwtPayLoad>(token);
      if (decoded.role) {
        return decoded.role;
      }
    }
    return '';
  }

  public async login(
    data: LoginRequestDto
  ): Promise<ClientResponse<LoginResponseDto | null>> {
    try {
      const response: AxiosResponse<LoginResponseDto> = await this.client.post(
        '/auth/login',
        data
      );

      this.client.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.token}`;

      const decoded = jwtDecode<MyJwtPayLoad>(response.data.token);

      if (decoded.exp) {
        this.cookies.set('token', response.data.token, {
          expires: new Date(decoded.exp * 1000),
        });

        this.cookies.set('refreshToken', response.data.refreshToken);
      }

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async register(
    data: RegisterRequestDto
  ): Promise<ClientResponse<RegisterResponseDto | null>> {
    try {
      const response: AxiosResponse<RegisterResponseDto> =
        await this.client.post('/auth/register', data);

      this.client.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.token}`;

      const decoded = jwtDecode<MyJwtPayLoad>(response.data.token);

      if (decoded.exp) {
        this.cookies.set('token', response.data.token, {
          expires: new Date(decoded.exp * 1000),
        });

        this.cookies.set('refreshToken', response.data.refreshToken);
      }

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 500,
      };
    }
  }

  public async refreshToken(): Promise<void> {
    const refreshToken = this.cookies.get('refreshToken');

    if (refreshToken) {
      const response = await this.client.post('/auth/refresh', {
        refreshToken: refreshToken,
      });

      this.client.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.token}`;

      const decoded = jwtDecode<MyJwtPayLoad>(response.data.token);

      if (decoded.exp) {
        this.cookies.set('token', response.data.token, {
          expires: new Date(decoded.exp * 1000),
        });

        this.cookies.set('refreshToken', response.data.refreshToken);
      }
    }
  }

  public signOut(): void {
    this.cookies.remove('token');
    this.client.defaults.headers.common['Authorization'] = '';
  }

  public async registerUser(
    data: RegisterRequestDto
  ): Promise<ClientResponse<RegisterResponseDto | null>> {
    try {
      const response: AxiosResponse<RegisterResponseDto> =
        await this.client.post('/auth/register', data);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }
}
