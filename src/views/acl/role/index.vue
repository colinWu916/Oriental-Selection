<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">
          搜索
        </el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        prop="cnName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建世间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">
            分配权限
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
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
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 添加职位与更新已有职位的结构:对话框 -->
  <!-- <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisite = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog> -->
  <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
// //请求方法
import { reqAllRoleList, reqAllMenuList, reqSetPermisstion } from '@/api/acl/role'
// import { reqRemoveRole, reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion } from '@/api/acl/role';
// import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
// //引入骨架的仓库
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'
// import { ElMessage } from 'element-plus';
let settingStore = useLayOutSettingStore()
// //当前页码
let pageNo = ref<number>(1)
// //一页展示几条数据
let pageSize = ref<number>(10)
// //搜索职位关键字
let keyword = ref<string>('')
// //存储全部已有的职位
let allRole = ref<any[]>([])
// //职位总个数
let total = ref<number>(0)
// //控制对话框的显示与隐藏
// let dialogVisite = ref<boolean>(false);
// //获取form组件实例
// let form = ref<any>();
// //控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
// //收集新增岗位数据
let RoleParams = reactive<any>({
  id: '',
  roleName: '',
})
// //准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([])
// //定义数组存储用户权限的数据
let menuArr = ref<any>()
// //获取tree组件实例
let tree = ref<any>()
// //组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole()
})
// //获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  const postData = {
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    keyword: keyword.value,
  }
  let result: any = await reqAllRoleList(postData)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
//下拉菜单的回调
const sizeChange = () => {
  getHasRole()
}
// //搜索按钮的回调
const search = () => {
  //再次发请求根据关键字
  getHasRole()
  keyword.value = ''
}
// //重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
//添加职位按钮的回调
const addRole = () => {}
//更新已有的职位按钮的回调
const updateRole = (row: any) => {
  // dialogVisite.value = true;
  // Object.assign(RoleParams, row);
  // nextTick(() => {
  //   form.value.clearValidate('roleName');
  // })
}
// //自定义校验规则的回调
// const validatorRoleName = (rule: any, value: any, callBack: any) => {
//   if (value.trim().length >= 2) {
//     callBack();
//   } else {
//     callBack(new Error('职位名称至少两位'))
//   }
// }
// //职位校验规则
// const rules = {
//   roleName: [
//     { required: true, trigger: 'blur', validator: validatorRoleName }
//   ]
// }

// //确定按钮的回调
// const save = async () => {
//   //表单校验结果,结果通过在发请求、结果没有通过不应该在发生请求
//   await form.value.validate();
//   //添加职位|更新职位的请求
//   let result: any = await reqAddOrUpdateRole(RoleParams);
//   if (result.code == 200) {
//     //提示文字
//     ElMessage({ type: 'success', message: RoleParams.id ? '更新成功' : '添加成功' });
//     //对话框显示
//     dialogVisite.value = false;
//     //再次获取全部的已有的职位
//     getHasRole(RoleParams.id ? pageNo.value : 1);
//   }
// }

//分配权限按钮的回调
//已有的职位的数据
const setPermisstion = async (row: any) => {
  RoleParams.id = row.id
  drawer.value = true
  let result: any = await reqAllMenuList({ id: RoleParams.id })
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
//树形控件的测试数据
const defaultProps = {
  children: 'children',
  label: 'name',
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

// //抽屉确定按钮的回调
const handler = async () => {
  const roleId = RoleParams.id as number
  let arr = tree.value.getCheckedKeys()
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  const postData = {
    roleId,
    permissionId,
  }
  let result: any = await reqSetPermisstion(postData)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({ type: 'success', message: '分配权限成功' })
    window.location.reload()
  }
}

//删除已有的职位
const removeRole = async (id: number) => {
  // let result: any = await reqRemoveRole(id);
  // if (result.code == 200) {
  //   ElMessage({ type: 'success', message: '删除成功' });
  //   getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
  // }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
