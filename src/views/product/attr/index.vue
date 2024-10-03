<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin:10px 0px">
      <div v-show="scene == 0">
        <el-table border style="margin:10px 0px" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag style="margin:5px" v-for="(item, index) in row.attrValueList" :key="item.id">{{
                item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`你确定删除${row.attrName}?`" width="200px" @confirm="deleteAttr(row.index)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
// import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr';
// import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
// import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';
// let categoryStore = useCategoryStore();
let attrArr = ref<any[]>([
  {
    index: 1,
    attrName: '手机一级',
    attrValueList: [
      { id: 1, valueName: '苹果手机' },
      { id: 2, valueName: '安卓手机222' },
      { id: 3, valueName: '安卓手机111' },
      { id: 4, valueName: '苹果手机' },
      { id: 5, valueName: '安卓手机' },
      { id: 6, valueName: '苹果手机' }
    ]
  },
  {
    index: 2,
    attrName: '电池容量',
    attrValueList: [
      { id: 1, valueName: '1200mAh以下' },
      { id: 2, valueName: '1200mAh到3000mAh' },
      { id: 3, valueName: '3000mAh以上' }
    ]
  },
  {
    index: 3,
    attrName: '运行内存',
    attrValueList: [
      { id: 1, valueName: '128G' },
      { id: 2, valueName: '6G' },
      { id: 3, valueName: '256G' }
    ]
  },
  {
    index: 4,
    attrName: '机身内存',
    attrValueList: [
      { id: 1, valueName: '512G' },
      { id: 2, valueName: '64G' },
      { id: 3, valueName: '256G' },
      { id: 4, valueName: '1T' },
      { id: 5, valueName: '32G' },
      { id: 6, valueName: '128G' }
    ]
  },
  {
    index: 5,
    attrName: 'CPU型号',
    attrValueList: [
      { id: 1, valueName: '骁龙730G' },
      { id: 2, valueName: '麒麟990' },
      { id: 3, valueName: '骁龙439' },
      { id: 4, valueName: '5G骁龙845' },
      { id: 5, valueName: '骁龙768G' }
    ]
  },
  {
    index: 6,
    attrName: '屏幕尺寸',
    attrValueList: [
      { id: 1, valueName: '6.55-6.64英寸' },
      { id: 2, valueName: '6.95英寸及以上' },
      { id: 3, valueName: '6.85-6.94英寸' },
      { id: 4, valueName: '6.65-6.74英寸' },
      { id: 5, valueName: '6.0-6.24英寸' }
    ]
  },
  {
    index: 7,
    attrName: '颜色YYDS',
    attrValueList: [
      { id: 1, valueName: '天蓝色' },
      { id: 2, valueName: '绿色' },
      { id: 3, valueName: '紫色' }
    ]
  }
]);
let scene = ref<number>(0);
// let attrParams = reactive<Attr>({
//   attrName: "",
//   attrValueList: [
//   ],
//   categoryId: '',
//   categoryLevel: 3,
// })
// let inputArr = ref<any>([]);
// watch(() => categoryStore.c3Id, () => {
//   attrArr.value = [];
//   if (!categoryStore.c3Id) return;
//   getAttr();
// })
// const getAttr = async () => {
//   const { c1Id, c2Id, c3Id } = categoryStore;
//   let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
//   if (result.code == 200) {
//     attrArr.value = result.data;
//   }
// }
// const addAttr = () => {
//   Object.assign(attrParams, {
//     attrName: "",
//     attrValueList: [
//     ],
//     categoryId: categoryStore.c3Id,
//     categoryLevel: 3,
//   })
//   scene.value = 1;
// }
const updateAttr = (row: Attr) => {}
// const cancel = () => {
//   scene.value = 0;
// }
// const addAttrValue = () => {
//   attrParams.attrValueList.push({
//     valueName: '',
//     flag: true,
//   });
//   nextTick(() => {
//     inputArr.value[attrParams.attrValueList.length - 1].focus();
//   })

// }
// const save = async () => {
//   let result: any = await reqAddOrUpdateAttr(attrParams);
//   if (result.code == 200) {
//     scene.value = 0;
//     ElMessage({
//       type: 'success',
//       message: attrParams.id ? '修改成功' : '添加成功'
//     });
//     getAttr();
//   } else {
//     ElMessage({
//       type: 'error',
//       message: attrParams.id ? '修改失败' : '添加失败'
//     })
//   }
// }

// const toLook = (row: AttrValue, $index: number) => {
//   if (row.valueName.trim() == '') {
//     attrParams.attrValueList.splice($index, 1);
//     ElMessage({
//       type: 'error',
//       message: '属性值不能为空'
//     })
//     return;
//   }
//   let repeat = attrParams.attrValueList.find((item) => {
//     if (item != row) {
//       return item.valueName === row.valueName;
//     }
//   });

//   if (repeat) {
//     attrParams.attrValueList.splice($index, 1);
//     ElMessage({
//       type: 'error',
//       message: '属性值不能重复'
//     })
//     return;
//   }
//   row.flag = false;
// }

// const toEdit = (row: AttrValue, $index: number) => {
//   row.flag = true;
//   nextTick(() => {
//     inputArr.value[$index].focus();
//   })

// }

const deleteAttr = async (attrId: number) => {
  const index = attrArr.value.findIndex(n => n.index == attrId);
  if (index == -1) return ElMessage({
    type: 'error',
    message: '删除失败'
  })
  attrArr.value.splice(index, 1)
}

// onBeforeUnmount(() => {
//   categoryStore.$reset();
// })
</script>

<style scoped></style>