<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right:10px" @click="changeIcon">
    <component :is="layOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包动态展示路由名字与标题 -->
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <!-- 图标 -->
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting';
import { useRoute } from 'vue-router';
const layOutSettingStore = useLayOutSettingStore();
const $route = useRoute();

const changeIcon = () => {
  layOutSettingStore.fold = !layOutSettingStore.fold;
}

</script>
<script lang="ts">
export default {
  name: "Breadcrumb"
}
</script>

<style scoped></style>