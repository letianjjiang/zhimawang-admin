import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    code: string;
    created_at?: string;
    description?: string;
    id?: number;
    name: string;
    permissions?: number[];
    status: number;
    updated_at?: string;
  }

  export interface RoleListParams {
    code?: string;
    name?: string;
    page?: number;
    pageSize?: number;
    status?: number;
  }
}

/**
 * 获取系统角色列表
 */
export async function getSystemRolesApi(
  params: SystemRoleApi.RoleListParams = {},
) {
  return requestClient.get<SystemRoleApi.SystemRole[]>(
    '/api/admin/system/roles',
    { params },
  );
}

/**
 * 获取角色列表（用于表格组件）
 */
export async function getRoleList(params: SystemRoleApi.RoleListParams = {}) {
  const result = await getSystemRolesApi(params);
  return {
    items: result,
    total: result.length,
  };
}

/**
 * 创建系统角色
 */
export async function createRole(
  data: Omit<SystemRoleApi.SystemRole, 'created_at' | 'id' | 'updated_at'>,
) {
  return requestClient.post('/api/admin/system/roles', data);
}

/**
 * 更新系统角色
 */
export async function updateRole(
  id: number,
  data: Omit<SystemRoleApi.SystemRole, 'created_at' | 'id' | 'updated_at'>,
) {
  return requestClient.put(`/api/admin/system/roles/${id}`, data);
}

/**
 * 删除系统角色
 */
export async function deleteRole(id: number) {
  return requestClient.delete(`/api/admin/system/roles/${id}`);
}

/**
 * 获取角色详情
 */
export async function getRoleDetailApi(id: number) {
  return requestClient.get<SystemRoleApi.SystemRole>(
    `/api/admin/system/roles/${id}`,
  );
}
