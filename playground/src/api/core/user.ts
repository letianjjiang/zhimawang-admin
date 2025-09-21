import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/api/user/info');
}

/**
 * 用户会话信息接口
 */
export namespace UserSessionApi {
  /** 会话信息 */
  export interface SessionInfo {
    created_at: number[];
    device_name: string;
    device_type: string;
    ip_first: string;
    ip_last: string;
    last_seen_at: number[];
    session_id: string;
  }
}

/**
 * 获取用户会话信息
 */
export async function getUserSessionsApi() {
  return requestClient.get<UserSessionApi.SessionInfo[]>('/api/user/sessions');
}
