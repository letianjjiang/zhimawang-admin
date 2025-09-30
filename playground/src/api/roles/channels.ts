import { requestClient } from '#/api/request';

export namespace RolesChannelsApi {
  export interface Channel {
    [key: string]: any;
    created_at: string;
    description?: string;
    id: number;
    name: string;
    status: number;
    updated_at: string;
  }

  export interface ChannelsListParams {
    [key: string]: any;
    page?: number;
    pageSize?: number;
  }
}

/**
 * 获取角色频道列表
 */
export async function getRolesChannelsApi(
  params: RolesChannelsApi.ChannelsListParams = {},
) {
  return requestClient.get<RolesChannelsApi.Channel[]>(
    '/api/admin/roles/channels',
    { params },
  );
}

/**
 * 创建角色频道
 */
export async function createRolesChannelApi(
  data: Omit<RolesChannelsApi.Channel, 'created_at' | 'id' | 'updated_at'>,
) {
  return requestClient.post('/api/admin/roles/channels', data);
}

/**
 * 更新角色频道
 */
export async function updateRolesChannelApi(
  id: number,
  data: Omit<RolesChannelsApi.Channel, 'created_at' | 'id' | 'updated_at'>,
) {
  return requestClient.put(`/api/admin/roles/channels/${id}`, data);
}

/**
 * 删除角色频道
 */
export async function deleteRolesChannelApi(id: number) {
  return requestClient.delete(`/api/admin/roles/channels/${id}`);
}
