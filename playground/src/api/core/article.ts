import { requestClient } from '#/api/request';

export namespace ArticleApi {
  /** 文章列表查询参数 */
  export interface ArticleListParams {
    contentType?: number; // 内容类型：1=文章, 2=论坛帖, 不传=所有类型
    limit?: number; // 每页文章数量，默认10
    offset?: number; // 分页偏移量，默认0
  }

  /** 文章列表项 */
  export interface ArticleItem {
    id: number;
    title: string;
    author: string;
    cover: string;
    comments: number;
    contentType: string;
    views: number;
    createdAt: string;
  }

  /** 文章列表响应 */
  export interface ArticleListResponse {
    status: string;
    message: string;
    data: ArticleItem[];
    errorCode?: string;
    debugInfo?: string;
  }
}

/**
 * 获取文章列表
 */
export async function getArticleListApi(params: ArticleApi.ArticleListParams = {}) {
  return requestClient.get<ArticleApi.ArticleItem[]>('/api/articles', { params });
}
