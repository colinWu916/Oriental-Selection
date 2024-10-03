<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="search">搜索</el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button type="primary" size="default" :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser">批量删除</el-button>
    <el-table @selection-change="selectChange" style="margin: 10px 0px;" border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasUser"
      @size-change="handler" />
  </el-card>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox @change="handleCheckAllChange" v-model="checkAll">全选</el-checkbox>
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role.name">{{ role.cnName
              }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqUserInfo, reqAllRole, reqSetUserRole, reqAddOrUpdateUser } from '@/api/acl/user'
import { ElMessage } from 'element-plus';
// //默认页码
let pageNo = ref<number>(1);
// //一页展示几条数据
let pageSize = ref<number>(7);
// //用户总个数
let total = ref<number>(0);
// //存储全部用户的数组
let userArr = ref<any>([]);
// //定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false);
// //控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false);
// //存储全部职位的数据
let allRole = ref<any[]>([]);
// //当前用户已有的职位
let userRole = ref<any>([]);
// //收集用户信息的响应式数据
let userParams = reactive<any>({
  username: '',
  name: '',
  id: '',
  password: ''
});
// //准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<any[]>([]);
// //获取form组件实例
let formRef = ref<any>();
// //定义响应式数据:收集用户输入进来的关键字
let keyword = ref<string>('');
// //获取模板setting仓库
let settingStore = useLayOutSettingStore();
// //组件挂载完毕
onMounted(() => {
  getHasUser();
});
//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager;
  const postData = {
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    keyword: keyword.value
  }
  let result = await reqUserInfo(postData);
  if (result.code == 200) {
    total.value = result.data.total;
    userArr.value = result.data.records.map((n: any) => {
      const { roleName } = n;
      n.roleMessage = JSON.parse(JSON.stringify(roleName));
      const nameArr = roleName.map((n: any) => {
        return n.cnName;
      })
      let str = nameArr.join(', ');
      n.roleName = str;
      return n;
    });
  }
}
//分页器下拉菜单的自定义事件的回调
const handler = () => {
  getHasUser();
}
//添加用户按钮的回调
const addUser = () => {
  drawer.value = true;
  nextTick(() => {
      formRef.value.clearValidate('username');
      formRef.value.clearValidate('name');
      formRef.value.clearValidate('password');
  });
}
// //更新已有的用户按钮的回调
// //row:即为已有用户的账号信息
const updateUser = (row: any) => {
  drawer.value = true;
  userParams.name = row.name;
  userParams.password = row.password;
  userParams.username = row.username;
  userParams.id = row.id;
  nextTick(() => {
    formRef.value.clearValidate('username');
    formRef.value.clearValidate('name');
  });
}
//保存按钮的回调
const save = async () => {
  //点击保存按钮的时候,务必需要保证表单全部复合条件在去发请求
  await formRef.value.validate()
  //保存按钮:添加新的用户|更新已有的用户账号信息
  let result: any = await reqAddOrUpdateUser(userParams);
  //添加或者更新成功
  if (result.code == 200) {
      //关闭抽屉
      drawer.value = false;
      //提示消息
      ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' });
      //获取最新的全部账号的信息
      // getHasUser(userParams.id ? pageNo.value : 1);
      //浏览器自动刷新一次
      window.location.reload();
  } else {
      //关闭抽屉
      drawer.value = false;
      //提示消息
      ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' });
  }
}
//取消按钮的回调
const cancel = () => {
  //关闭抽屉
  drawer.value = false;
}
//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
      callBack();
  } else {
      callBack(new Error('用户名字至少五位'))
  }
}
//校验用户名字回调函数
const validatorname = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
      callBack();
  } else {
      callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 6) {
      callBack();
  } else {
      callBack(new Error('用户密码至少六位'))
  }
}
// //表单校验的规则对象
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户的密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
//分配角色按钮的回调
const setRole = async (row: any) => {
  userRole.value = [];
  const { roleMessage, username, id } = row;
  userParams.username = username;
  userParams.id = id;
  userRole.value = roleMessage.map((n: any) => {
    return n.name;
  })
  let result: any = await reqAllRole();
  if (result.code == 200) {
    allRole.value = result.data;
    drawer1.value = true;
  }
}

// //收集顶部复选框全选数据
const checkAll = ref<boolean>(false);
// //控制顶部全选复选框不确定的样式
// const isIndeterminate = ref<boolean>(true);
// //顶部的全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value.map(n => {
    return n.name;
  }) : [];
}
// //顶部全部的复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  checkAll.value = value.length === allRole.value.length;
}
//确定按钮的回调(分配职位)
const confirmClick = async () => {
  let data = {
    userId: userParams.id,
    userRole: userRole.value
  }
  let result: any = await reqSetUserRole(data);
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '分配职务成功' });
    drawer1.value = false;
    getHasUser(pageNo.value);
  }
}

//删除某一个用户
const deleteUser = async (userId: number) => {
  // let result: any = await reqRemoveUser(userId);
  // if (result.code == 200) {
  //   ElMessage({ type: 'success', message: '删除成功' });
  //   getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  // }
}
//table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value;
}
//批量删除按钮的回调
const deleteSelectUser = async () => {
  // let idsList: any = selectIdArr.value.map(item => {
  //   return item.id;
  // });
  // let result: any = await reqSelectUser(idsList);
  // if (result.code == 200) {
  //   ElMessage({ type: 'success', message: '删除成功' });
  //   getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  // }
}

//搜索按钮的回调
const search = () => {
  //根据关键字获取相应的用户数据
  getHasUser();
}
//重置按钮
const reset = () => {
  settingStore.refsh = !settingStore.refsh;
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>