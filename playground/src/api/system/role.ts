import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    id?: number;
    name: string;
    code: string;
    description?: string;
    status: number;
    permissions?: number[];
    created_at?: string;
    updated_at?: string;
  }

  export interface RoleListParams {
    page?: number;
    pageSize?: number;
    name?: string;
    code?: string;
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
export async function getRoleList(
  params: SystemRoleApi.RoleListParams = {},
) {
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
  data: Omit<SystemRoleApi.SystemRole, 'id' | 'created_at' | 'updated_at'>,
) {
  return requestClient.post('/api/admin/system/roles', data);
}

/**
 * 更新系统角色
 */
export async function updateRole(
  id: number,
  data: Omit<SystemRoleApi.SystemRole, 'id' | 'created_at' | 'updated_at'>,
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
