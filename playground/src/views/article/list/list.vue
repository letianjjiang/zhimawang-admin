<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, confirm } from '@vben/common-ui';

import { Button, Tag, Image, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getArticleListApi, getArticleDetailApi } from '#/api/core/article';
import type { ArticleApi } from '#/api/core/article';
import { ref } from 'vue';

interface RowType extends ArticleApi.ArticleItem {}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { fixed: 'left', title: '序号', type: 'seq', width: 50 },
    { field: 'id', title: '文章ID', width: 80 },
    { field: 'title', title: '文章标题', width: 300 },
    { field: 'author', title: '作者', width: 120 },
    { field: 'cover', title: '封面', width: 70, slots: { default: 'cover' } },
    { 
      field: 'contentType', 
      title: '内容类型', 
      width: 100,
      slots: { default: 'contentType' }
    },
    { field: 'views', title: '浏览量', width: 100 },
    { field: 'comments', title: '评论数', width: 80 },
    {
      field: 'createdAt',
      formatter: 'formatDateTime',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 150,
    },
  ],
  height: 'auto',
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const result = await getArticleListApi({
          limit: page.pageSize,
          offset: (page.currentPage - 1) * page.pageSize,
        });
        // 返回符合 VxeGrid 期望的数据格式
        return {
          items: result, // VxeGrid 期望的数据字段名
          total: result.length, // 总数，注意：这里需要根据实际API返回的总数调整
        };
      },
    },
  },
  rowConfig: {
    isHover: true,
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
const [Drawer, drawerApi] = useVbenDrawer();
const drawerLoading = ref(false);
const drawerTitle = ref('基础示例');
const articleDetail = ref<ArticleApi.ArticleDetail | null>(null);

// 抽屉-基础信息网格
let infoRows: Array<{ label: string; value: string | number | null }> = [];
const infoGridOptions = {
  // 不设置height，避免在抽屉内重复计算造成空白累积
  minHeight: undefined,
  border: true,
  showHeader: true,
  columns: [
    { field: 'label', title: '字段', width: 120 },
    { field: 'value', title: '值' },
  ],
  data: infoRows,
};
const [InfoGrid, infoGridApi] = useVbenVxeGrid({ gridOptions: infoGridOptions });

// 抽屉-图片网格
interface ImageRow { pictureId: number; pictureUrl: string }
let imagesRows: ImageRow[] = [];
const imagesGridOptions = {
  minHeight: undefined,
  border: true,
  columns: [
    { field: 'pictureId', title: '图片ID', width: 100 },
    {
      field: 'preview',
      title: '预览',
      width: 160,
      slots: { default: 'img' },
    },
    { field: 'pictureUrl', title: '地址' },
  ],
  data: imagesRows,
};
const [ImagesGrid, imagesGridApi] = useVbenVxeGrid({ gridOptions: imagesGridOptions });

// 抽屉-评论网格
interface CommentRow {
  commentId: number;
  userId: number;
  comments: string;
  createdAt: string;
  ipLocation?: string;
}
let commentsRows: CommentRow[] = [];
const commentsGridOptions = {
  minHeight: undefined,
  border: true,
  columns: [
    { field: 'commentId', title: '评论ID', width: 90 },
    { field: 'userId', title: '用户ID', width: 100 },
    { field: 'comments', title: '内容' },
    { field: 'createdAt', title: '时间', width: 180 },
    { field: 'ipLocation', title: 'IP', width: 120 },
  ],
  data: commentsRows,
};
const [CommentsGrid, commentsGridApi] = useVbenVxeGrid({ gridOptions: commentsGridOptions });

// 事件处理函数
const handleView = async (row: RowType) => {
  drawerTitle.value = row.title ?? '文章详情';
  drawerLoading.value = true;
  articleDetail.value = null;
  drawerApi.open();
  try {
    const detail = await getArticleDetailApi(row.id);
    articleDetail.value = detail;
    // 填充基础信息
    infoRows = [
      { label: '文章ID', value: detail.articleId },
      { label: '标题', value: detail.articleName },
      { label: '作者', value: detail.articleWriter },
      { label: '内容', value: detail.articleContent },
      { label: '类型', value: detail.contentType ?? '' },
      { label: '状态', value: detail.status ?? '' },
      { label: '置顶', value: detail.isTop ?? '' },
      { label: '精选', value: detail.isFeatured ?? '' },
      { label: '浏览量', value: detail.viewCount },
      { label: '评论数', value: detail.replyCount ?? '' },
      { label: '创建时间', value: detail.createdAt },
      { label: '更新时间', value: detail.updatedAt ?? '' },
      { label: '最后回复', value: detail.lastReplyAt ?? '' },
    ];
    infoGridApi.setGridOptions({ data: infoRows });
    // 填充图片
    imagesRows = (detail.images || []).map((i) => ({ pictureId: i.pictureId, pictureUrl: i.pictureUrl }));
    imagesGridApi.setGridOptions({ data: imagesRows });
    // 填充评论
    commentsRows = (detail.comments || []).map((c) => ({
      commentId: c.commentId,
      userId: c.userId,
      comments: c.comments,
      createdAt: c.createdAt,
      ipLocation: c.ipLocation,
    }));
    commentsGridApi.setGridOptions({ data: commentsRows });
    // 重新计算布局，避免高度累积
    infoGridApi.grid?.recalculate?.();
    imagesGridApi.grid?.recalculate?.();
    commentsGridApi.grid?.recalculate?.();
  } finally {
    drawerLoading.value = false;
  }
};

const handleEdit = (row: RowType) => {
  console.log('编辑文章:', row);
  // TODO: 跳转到文章编辑页面
};

const handleDelete = (row: RowType) => {
  confirm({
    icon: 'warning',
    content: `删除文章《${row.title ?? row.id}》将会联动文章的所有评论、点赞数量、图片和浏览量也一并删除，此操作不可恢复，是否继续？`,
  })
    .then(async () => {
      // TODO: 调用删除文章API，例如：await deleteArticleApi(row.id)
      // 这里先做一个异步占位，待接入真实API后移除
      await new Promise((resolve) => setTimeout(resolve, 600));
      message.success('删除成功');
      // TODO: 删除成功后刷新列表数据
      // 若需要：gridApi?.reload?.()
    })
    .catch(() => {
      // 用户取消，无需处理
    });
};

</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #cover="{ row }">
        <Image :src="row.cover" height="30" width="30" />
      </template>

      <template #contentType="{ row }">
        <Tag :color="row.contentType === 'all' ? 'blue' : 'green'">
          {{ row.contentType === 'all' ? '全部' : row.contentType }}
        </Tag>
      </template>
      
      <template #action="{ row }">
        <Button type="link" size="small" @click="handleView(row)">查看</Button>
        <Button type="link" size="small" @click="handleEdit(row)">编辑</Button>
        <Button type="link" size="small" danger @click="handleDelete(row)">删除</Button>
      </template>
    </Grid>
    <Drawer class="w-[800px]" :title="drawerTitle">
      <div v-if="drawerLoading" class="text-center text-gray-400 py-6">加载中...</div>
      <div v-else>
        <div class="mb-3">
          <div class="mb-2 font-medium">基础信息</div>
          <InfoGrid />
        </div>
        <div class="mb-3">
          <div class="mb-2 font-medium">全部图片</div>
          <ImagesGrid>
            <template #img="{ row }">
              <img :src="row.pictureUrl" alt="thumb" style="width:120px;height:120px;object-fit:cover;border-radius:4px;" />
            </template>
          </ImagesGrid>
        </div>
        
        <div>
          <div class="mb-2 font-medium">评论</div>
          <CommentsGrid />
        </div>
      </div>
    </Drawer>
  </Page>
</template>
