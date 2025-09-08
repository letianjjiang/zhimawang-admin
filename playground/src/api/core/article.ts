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

  /** 文章详情（精简字段，按需展示） */
  export interface ArticleDetail {
    articleId: number;
    articleName: string;
    articleContent: string;
    articleWriter: string;
    viewCount: number;
    createdAt: string;
    updatedAt?: string;
    lastReplyAt?: string;
    contentType?: number;
    channelId?: number | null;
    status?: number;
    isTop?: number;
    isFeatured?: number;
    replyCount?: number;
    images?: { pictureId: number; pictureUrl: string }[];
    comments?: Array<{
      commentId: number;
      parentId: number | null;
      articleId: number;
      userId: number;
      comments: string;
      createdAt: string;
      userAvatar?: string;
      ipLocation?: string;
      replies?: any[];
    }>;
    author?: {
      userId: number | null;
      username: string;
      nickname: string;
      role: string | null;
      ipAddress: string | null;
      wechatOpenid: string | null;
      userAvatar: string | null;
    };
    followStatus?: {
      isFollowing: boolean;
      isFollowedBy: boolean;
      isMutualFollow: boolean;
      followersCount: number;
      followingCount: number;
    };
  }
}

/**
 * 获取文章列表
 */
export async function getArticleListApi(params: ArticleApi.ArticleListParams = {}) {
  return requestClient.get<ArticleApi.ArticleItem[]>('/api/articles', { params });
}

/**
 * 获取文章详情
 */
export async function getArticleDetailApi(articleId: number) {
  return requestClient.get<ArticleApi.ArticleDetail>(`/api/articles/${articleId}`);
}
