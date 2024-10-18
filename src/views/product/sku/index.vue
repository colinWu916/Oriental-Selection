<template>
  <Category style="margin-bottom: 16px" :scene="scene"></Category>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column label="序号" prop="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip prop="skuName"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip prop="skuDesc"></el-table-column>
      <el-table-column label="重量" prop="weight"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.skuName}?`"
            width="200px"
            @confirm="removeSku(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
// //引入请求
// import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku'
// //引入ts类型
// import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type';
// import { ElMessage } from 'element-plus';
// //分页器当前页码
let pageNo = ref<number>(1)
let scene = ref<number>(0)
// //每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>(23)
let skuArr = ref<any[]>([])
let allData = ref<any[]>([
  {
    index: 1,
    skuName: '华为Mate 50 Pro',
    skuDesc: '超光变XMAGE影像，昆仑玻璃屏，鸿蒙操作系统3.0',
    weight: '约209g（含电池）',
    price: 6799.0,
    right: '立即购买',
  },
  {
    index: 2,
    skuName: '华为智慧屏V98',
    skuDesc: '98英寸AG防眩光巨幕，鸿鹄SuperMiniLED，120Hz高刷',
    weight: '约70kg（含底座）',
    price: 29999.0,
    right: '加入购物车',
  },
  {
    index: 3,
    skuName: '华为FreeBuds Pro 2',
    skuDesc: '动态降噪2.0，三麦克风+骨传导通话降噪，超宽频声场',
    weight: '单耳机约4.76g（含耳帽和麦克风）',
    price: 1299.0,
    right: '查看详情',
  },
  {
    index: 4,
    skuName: '华为MatePad Pro 11英寸',
    skuDesc: '11英寸OLED全面屏，HarmonyOS 3，第二代华为M-Pencil',
    weight: '约449g（不含笔和键盘）',
    price: 3499.0,
    right: '选择配置',
  },
  {
    index: 5,
    skuName: '华为Sound X New',
    skuDesc: '智能音箱，帝瓦雷联合设计，360°环绕音效',
    weight: '约3.5kg',
    price: 1999.0,
    right: '立即抢购',
  },
  {
    index: 6,
    skuName: '华为P50 Pocket',
    skuDesc: '折叠屏手机，超光谱影像系统，6.9英寸OLED屏幕',
    weight: '约190g（含电池）',
    price: 8988.0,
    right: '了解更多',
  },
  {
    index: 7,
    skuName: '华为Watch GT 3 Pro',
    skuDesc: '钛金属+蓝宝石玻璃，ECG心电采集，14天强劲续航',
    weight: '约42.6g（不含表带）',
    price: 2488.0,
    right: '立即购买',
  },
  {
    index: 8,
    skuName: '华为MateBook X Pro',
    skuDesc: '14.2英寸3K炫丽全面屏，第12代智能英特尔酷睿i7处理器',
    weight: '约1.38kg',
    price: 9999.0,
    right: '加入购物车',
  },
  {
    index: 9,
    skuName: '华为nova 10 Pro',
    skuDesc: '10号色100W超级快充，前置6000万超广角双摄',
    weight: '约191g（含电池）',
    price: 3699.0,
    right: '查看详情',
  },
  {
    index: 10,
    skuName: '华为智慧屏V75',
    skuDesc: '75英寸4K量子点屏，鸿鹄SuperMiniLED背光，120Hz疾速屏',
    weight: '约34.5kg（含底座）',
    price: 13999.0,
    right: '选择配置',
  },
  {
    index: 11,
    skuName: '华为FreeBuds Lipstick',
    skuDesc: '口红盒精致设计，半开放主动降噪，高解析音质',
    weight: '单耳机约4.1g（含耳帽和麦克风）',
    price: 1499.0,
    right: '立即抢购',
  },
  {
    index: 12,
    skuName: '华为MatePad 11',
    skuDesc: '10.95英寸120Hz全面屏，HarmonyOS 2，四声道四大振幅扬声器',
    weight: '约485g（不含笔和键盘）',
    price: 2499.0,
    right: '了解更多',
  },
  {
    index: 13,
    skuName: '华为Sound Joy 活力版',
    skuDesc: '便携智能音箱，帝瓦雷联合设计，防水设计',
    weight: '约680g',
    price: 1199.0,
    right: '立即购买',
  },
  {
    index: 14,
    skuName: '华为智慧屏SE65',
    skuDesc: '65英寸全面屏，智能液晶电视，4K超高清',
    weight: '约17.8kg（含底座）',
    price: 3299.0,
    right: '加入购物车',
  },
  {
    index: 15,
    skuName: '华为MateBook D 14 SE',
    skuDesc: '14英寸IPS全面屏，第11代智能英特尔酷睿i5处理器',
    weight: '约1.38kg',
    price: 4999.0,
    right: '查看详情',
  },
  {
    index: 16,
    skuName: '华为nova 9 SE',
    skuDesc: '一亿像素四摄，66W疾速快充，超曲屏幕设计',
    weight: '约191g（含电池）',
    price: 2199.0,
    right: '选择配置',
  },
  {
    index: 17,
    skuName: '华为智慧屏V55',
    skuDesc: '55英寸4K量子点屏，鸿鹄SuperMiniLED背光，AI慧眼',
    weight: '约14.5kg（含底座）',
    price: 7999.0,
    right: '立即抢购',
  },
  {
    index: 18,
    skuName: '华为Band 7',
    skuDesc: '96种运动模式，专业健康监测，两周长续航',
    weight: '约16g（不含表带）',
    price: 249.0,
    right: '了解更多',
  },
  {
    index: 19,
    skuName: '华为MatePad Paper',
    skuDesc: '10.3英寸墨水屏，HarmonyOS 2，第二代M-Pencil手写笔',
    weight: '约360g（不含手写笔）',
    price: 2999.0,
    right: '立即购买',
  },
  {
    index: 20,
    skuName: '华为FreeBuds 4E',
    skuDesc: '主动降噪，半开放入耳设计，高解析音质',
    weight: '单耳机约4.1g（含耳帽和麦克风）',
    price: 699.0,
    right: '加入购物车',
  },
  {
    index: 21,
    skuName: '华为MateBook 13s',
    skuDesc: '13.4英寸2.5K全面屏，第11代智能英特尔酷睿i7处理器',
    weight: '约1.29kg',
    price: 7999.0,
    right: '查看详情',
  },
  {
    index: 22,
    skuName: '华为P40 Pro+',
    skuDesc: '徕卡超感知影像，88°超曲环幕屏，麒麟990 5G SoC芯片',
    weight: '约209g（含电池）',
    price: 7988.0,
    right: '选择配置',
  },
  {
    index: 23,
    skuName: '华为智慧屏S75 Pro',
    skuDesc: '75英寸4K全面屏，AI慧眼，鸿鹄画质引擎',
    weight: '约28.2kg（含底座）',
    price: 8999.0,
    right: '立即抢购',
  },
])
// //控制抽屉显示与隐藏的字段
// let drawer = ref<boolean>(false);
// let skuInfo = ref<any>({});
// //组件挂载完毕
// onMounted(() => {
//   getHasSku();
// });
const getHasSku = async (pager = 1) => {
  // pageNo.value = pager;
  // let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
  // if (result.code == 200) {
  //     total.value = result.data.total;
  //     skuArr.value = result.data.records;
  // }
  pageNo.value = pager
  skuArr.value = allData.value.slice(
    (pageNo.value - 1) * pageSize.value,
    pageNo.value * pageSize.value,
  )
}
// //分页器下拉菜单发生变化触发
const handler = (pageSizes: number) => {
  getHasSku()
}

//商品的上架与下架的操作
const updateSale = async (row: any) => {
  // //如果当前商品的isSale==1,说明当前商品是上架的额状态->更新为下架
  // //否则else情况与上面情况相反
  // if (row.isSale == 1) {
  //     //下架操作
  //     await reqCancelSale((row.id as number));
  //     //提示信息
  //     ElMessage({ type: 'success', message: '下架成功' });
  //     //发请求获取当前更新完毕的全部已有的SKU
  //     getHasSku(pageNo.value);
  // } else {
  //     //下架操作
  //     await reqSaleSku((row.id as number));
  //     //提示信息
  //     ElMessage({ type: 'success', message: '上架成功' });
  //     //发请求获取当前更新完毕的全部已有的SKU
  //     getHasSku(pageNo.value);
  // }
}
// //更新已有的SKU
const updateSku = () => {
  // ElMessage({ type: 'success', message: '程序员在努力的更新中....' })
}
//查看商品详情按钮的回调
const findSku = async (row: any) => {
  // //抽屉展示出来
  // drawer.value = true;
  // //获取已有商品详情数据
  // let result: SkuInfoData = await reqSkuInfo((row.id as number));
  // //存储已有的SKU
  // skuInfo.value = result.data;
}
// //删除某一个已有的商品
const removeSku = async (id: number) => {
  // //删除某一个已有商品的情况
  // let result: any = await reqRemoveSku(id);
  // if (result.code == 200) {
  //     //提示信息
  //     ElMessage({ type: 'success', message: '删除成功' });
  //     //获取已有全部商品
  //     getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  // } else {
  //     //删除失败
  //     ElMessage({ type: 'error', message: '系统数据不能删除' });
  // }
}
onBeforeMount(() => {
  getHasSku()
})
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
