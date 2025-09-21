import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /**
   * 用户描述
   */
  desc: string;
  /**
   * 首页地址
   */
  homePath: string;

  /**
   * accessToken
   */
  token: string;
  /**
   * 用户昵称（别名）
   */
  nickname?: string;
  /**
   * IP地址
   */
  ipAddress?: string;
  /**
   * 微信OpenID
   */
  wechatOpenid?: string;
  /**
   * 用户头像URL
   */
  userAvatar?: string;
  /**
   * 用户角色（单个角色）
   */
  role?: string;
  /**
   * 手机号（E164格式）
   */
  phoneE164?: string;
  /**
   * 手机号（原始格式）
   */
  phone?: string;
  /**
   * 密码（通常为null）
   */
  password?: null | string;
}

export type { UserInfo };
