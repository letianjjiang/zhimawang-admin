import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    identifier: string;
    phone: string;
    type: 'password' | 'sms';
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    expiresIn: number;
    nickname: string;
    phone: string;
    refreshExpiresIn: number;
    refreshToken: string;
    role: string;
    sessionId: string;
    token: string;
    userId: number;
    username: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/api/user/login', data, {
    withCredentials: true,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/api/auth/refresh',
    null,
    {
      withCredentials: true,
    },
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/api/user/logout', null, {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 * 注意：知马网API暂不支持权限码功能，返回空数组
 */
export async function getAccessCodesApi() {
  // 知马网API暂不支持权限码功能，返回空数组
  return [];
}
