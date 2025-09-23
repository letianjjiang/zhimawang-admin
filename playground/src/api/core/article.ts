import { requestClient } from '#/api/request';

export namespace ArticleApi {
  /** 文章列表查询参数 */
  export interface ArticleListParams {
    channelId?: number; // 频道ID，如果传入则优先根据频道ID获取文章
    limit?: number; // 每页文章数量，默认10
    offset?: number; // 分页偏移量，默认0
    pageId?: number; // 页面类型ID：对应pages表的page_id，如1=热门, 2=财经, 3=投资圈, 4=小红书, 5=留学圈等
    randomSeed?: number; // 随机种子：传入相同的种子值可确保随机顺序在分页间保持一致
  }

  /** 文章列表项 */
  export interface ArticleItem {
    articleId: number;
    articleName: string;
    author: {
      displayName: string;
      ipLocation: string;
      nickname: string;
      userAvatar: string;
      userId: number;
      username: string;
    };
    commentCount: number;
    createdAt: string;
    images: Array<{
      pictureUrl: string;
    }>;
    isAds: boolean;
    isLiked: boolean;
    likeCount: number;
    targetUrl: null | string;
  }

  /** 文章列表响应数据 */
  export interface ArticleListData {
    items: ArticleItem[];
    randomSeed: number;
    tip: string;
  }

  /** 文章列表响应 */
  export interface ArticleListResponse {
    data: ArticleListData;
    debugInfo?: string;
    errorCode?: string;
    message: string;
    status: string;
  }

  /** API响应包装器 */
  export interface ApiResponse<T> {
    data: T;
    debugInfo?: string;
    errorCode?: string;
    message: string;
    status: string;
  }

  /** 频道信息 */
  export interface ChannelItem {
    channelId: number;
    channelImgUrl?: null | string;
    channelName: string;
    channelType: number;
    parentId: number;
    sort: number;
  }

  /** 频道列表响应 */
  export interface ChannelListResponse {
    data: ChannelItem[];
    debugInfo?: string;
    errorCode?: string;
    message: string;
    status: string;
  }

  /** 文章详情（精简字段，按需展示） */
  export interface ArticleDetail {
    articleContent: string;
    articleId: number;
    articleName: string;
    articleWriter: string;
    author?: {
      ipAddress: null | string;
      nickname: string;
      role: null | string;
      userAvatar: null | string;
      userId: null | number;
      username: string;
      wechatOpenid: null | string;
    };
    channelId?: null | number;
    comments?: Array<{
      articleId: number;
      commentId: number;
      comments: string;
      createdAt: string;
      ipLocation?: string;
      parentId: null | number;
      replies?: any[];
      userAvatar?: string;
      userId: number;
    }>;
    contentType?: number;
    createdAt: string;
    followStatus?: {
      followersCount: number;
      followingCount: number;
      isFollowedBy: boolean;
      isFollowing: boolean;
      isMutualFollow: boolean;
    };
    images?: { pictureId: number; pictureUrl: string }[];
    isFeatured?: number;
    isTop?: number;
    lastReplyAt?: string;
    replyCount?: number;
    status?: number;
    updatedAt?: string;
    viewCount: number;
  }
}

/**
 * 获取文章列表
 */
export async function getArticleListApi(
  params: ArticleApi.ArticleListParams = {},
) {
  const response = await requestClient.get<ArticleApi.ArticleListData>(
    '/api/articles',
    { params },
  );
  return response.items; // 返回实际的文章数据数组
}

/**
 * 获取文章详情
 */
export async function getArticleDetailApi(articleId: number) {
  // requestClient 已通过默认拦截器与 responseReturn 解包 data 字段
  const response = await requestClient.get<ArticleApi.ArticleDetail>(
    `/api/articles/${articleId}`,
  );
  return response;
}

/**
 * 获取文章总浏览量（数据库基线 + Redis 增量）
 */
export async function getArticleViewsApi(articleId: number) {
  // 返回值已是 { total: number }
  const response = await requestClient.get<{ total: number }>(
    `/api/articles/${articleId}/views`,
  );
  return response;
}

/**
 * 获取频道列表
 */
export async function getChannelListApi(pageId: number) {
  const response = await requestClient.get<ArticleApi.ChannelItem[]>(
    '/api/articles/channels',
    {
      params: { pageId },
    },
  );
  return response; // requestClient 已经自动提取了 data 字段
}
