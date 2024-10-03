<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin:10px 0px">
      <div v-show="scene == 0">
        <el-table style="margin: 10px 0px;" border :data="records">
          <el-table-column label="序号" prop="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName" width="120px"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作"  width="300px">
            <!-- row:即为已有的SPU对象 -->
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="primary" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button type="primary" size="small" icon="View" title="查看SKU列表" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`你确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
          @current-change="getHasSpu" @size-change="changeSize" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// import type { HasSpuResponseData, Records, SkuInfoData, SkuData } from '@/api/product/spu/type'
import { ref, onBeforeMount } from 'vue';
// import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu';
// //引入分类的仓库
// import useCategoryStore from '@/store/modules/category';
// import type { SpuData } from '@/api/product/spu/type'
// import SpuForm from './spuForm.vue';
// import SkuForm from './skuForm.vue';
// import { ElMessage } from 'element-plus';
// let categoryStore = useCategoryStore();
// //场景的数据
let scene = ref<number>(0); //0:显示已有SPU  1:添加或者修改已有SPU 2:添加SKU的结构
// //分页器默认页码
let pageNo = ref<number>(1);
// //每一页展示几条数据
let pageSize = ref<number>(7);
// //存储已有的SPU的数据
let records = ref<any>([]);
let allData = ref<any>([
  {
    index: 1,
    spuName: 'OPPO',
    description: 'OPPO（OPPO广东移动通信有限公司）是一家全球领先的智能终端制造商，致力于提供创新的科技产品。'
  },
  {
    index: 2,
    spuName: 'vivo',
    description: 'vivo 是一家专注于智能手机及其相关产品的公司，以高品质的拍照功能和时尚设计而著称。'
  },
  {
    index: 3,
    spuName: '华为',
    description: '华为技术有限公司是一家全球领先的通信技术和智能手机制造商，以高端设备和网络解决方案而闻名。'
  },
  {
    index: 4,
    spuName: '小米',
    description: '小米科技有限公司是一家中国电子公司，主要生产智能手机、智能硬件及IoT产品，以高性价比而著称。'
  },
  {
    index: 5,
    spuName: '三星',
    description: '三星电子是全球最大的电子产品制造商之一，产品涵盖手机、电视、家电等多个领域。'
  },
  {
    index: 6,
    spuName: '苹果',
    description: '苹果公司是一家美国跨国科技公司，设计并销售消费电子、计算机软件及在线服务，iPhone系列产品享誉全球。'
  },
  {
    index: 7,
    spuName: '诺基亚',
    description: '诺基亚是一家以通讯设备和服务为主的公司，曾经是全球最大的手机制造商之一。'
  },
  {
    index: 8,
    spuName: '索尼',
    description: '索尼公司是一家多元化的科技和娱乐公司，产品包括消费电子、视频游戏及娱乐内容等。'
  },
  {
    index: 9,
    spuName: '一加',
    description: '一加科技是一家专注于高性能智能手机的制造商，致力于为用户提供优质的体验。'
  },
  {
    index: 10,
    spuName: 'LG',
    description: 'LG电子是一家全球知名的消费电子和家电制造商，以创新科技和设计著称。'
  },
  {
    index: 11,
    spuName: '魅族',
    description: '魅族科技是一家中国智能手机制造商，以其独特的设计和音频技术闻名。'
  },
  {
    index: 12,
    spuName: '中兴',
    description: '中兴通讯是一家中国领先的综合通信解决方案提供商，涉及移动终端、网络设备等多个领域。'
  },
  {
    index: 13,
    spuName: 'HTC',
    description: 'HTC是一家台湾的电子产品公司，以其智能手机和虚拟现实设备而知名。'
  },
  {
    index: 14,
    spuName: '摩托罗拉',
    description: '摩托罗拉是一家美国电信设备制造商，以生产高质量的智能手机和通信设备而闻名。'
  },
  {
    index: 15,
    spuName: '黑莓',
    description: '黑莓是一家曾经主导手机市场的公司，现在专注于软件和安全解决方案。'
  },
  {
    index: 16,
    spuName: '华硕',
    description: '华硕电脑是一家台湾公司，提供多种电子产品，包括电脑、手机及配件等。'
  },
  {
    index: 17,
    spuName: '联想',
    description: '联想是一家全球领先的科技公司，以其个人电脑、智能手机及数据中心解决方案而闻名。'
  },
  {
    index: 18,
    spuName: '佳能',
    description: '佳能公司是一家日本跨国公司，主要生产成像和光学产品，包括相机、复印机及打印机。'
  },
  {
    index: 19,
    spuName: '理光',
    description: '理光是一家提供打印和成像解决方案的公司，专注于办公设备和软件解决方案。'
  },
  {
    index: 20,
    spuName: '飞利浦',
    description: '飞利浦是一家全球知名的电子公司，提供医疗、照明和家电等多种产品。'
  },
  {
    index: 21,
    spuName: '松下',
    description: '松下电器是一家日本跨国电子公司，提供家用电器、消费电子及电池等产品。'
  }
]);
// //存储已有SPU总个数
let total = ref<number>(21);
// //获取子组件实例SpuForm
// let spu = ref<any>();
// //获取子组件实例SkuForm
// let sku = ref<any>();
// //存储全部的SKU数据
// let skuArr = ref<SkuData[]>([]);
// let show = ref<boolean>(false);
// //监听三级分类ID变化
// watch(() => categoryStore.c3Id, () => {
//   //当三级分类发生变化的时候清空对应的数据
//   records.value = [];
//   //务必保证有三级分类ID
//   if (!categoryStore.c3Id) return;
//   getHasSpu();
// });

// //此方法执行:可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  //修改当前页码
  // pageNo.value = pager;
  // let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id);
  // if (result.code == 200) {
  //   records.value = result.data.records;
  //   total.value = result.data.total;
  // }
  pageNo.value = pager;
  records.value = allData.value.slice((pageNo.value - 1)*pageSize.value, pageNo.value*pageSize.value);
}
// //分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu();
}

// //添加新的SPU按钮的回调
// const addSpu = () => {
//   //切换为场景1:添加与修改已有SPU结构->SpuForm
//   scene.value = 1;
//   //点击添加SPU按钮,调用子组件的方法初始化数据
//   spu.value.initAddSpu(categoryStore.c3Id);
// }
// //修改已有的SPU的按钮的回调
const updateSpu = (row: any) => {
  //切换为场景1:添加与修改已有SPU结构->SpuForm
  // scene.value = 1;
  //调用子组件实例方法获取完整已有的SPU的数据
  // spu.value.initHasSpuData(row);
}

// //子组件SpuForm绑定自定义事件:目前是让子组件通知父组件切换场景为0
// const changeScene = (obj: any) => {
//   //子组件Spuform点击取消变为场景0:展示已有的SPU
//   scene.value = obj.flag;
//   if (obj.params == 'update') {
//     //更新留在当前页
//     getHasSpu(pageNo.value);
//   } else {
//     //添加留在第一页
//     getHasSpu();
//   }
// }

//添加SKU按钮的回调
const addSku = (row:any) => {
  //点击添加SKU按钮切换场景为2
  // scene.value = 2;
  //调用子组件的方法初始化添加SKU的数据
  // sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
}

// //查看SKU列表的数据
const findSku = async (row: any) => {
  // let result: SkuInfoData = await reqSkuList((row.id as number));
  // if (result.code == 200) {
  //   skuArr.value = result.data;
  //   show.value = true;
  // }
}

//删除已有的SPU按钮的回调
const deleteSpu = async (row: any) => {
  // let result: any = await reqRemoveSpu((row.id as number));
  // if (result.code == 200) {
  //   ElMessage({
  //     type: 'success',
  //     message: '删除成功'
  //   });
  //   //获取剩余SPU数据
  //   getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  // } else {
  //   ElMessage({
  //     type: 'error',
  //     message: '删除失败'
  //   })
  // }
}

// //路由组件销毁前，情况仓库关于分类的数据
onBeforeMount(() => {
  getHasSpu();
})
</script>

<style scoped></style>