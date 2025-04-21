<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info"
            show-icon />

        <!-- 表格顶部菜单 -->
        <!-- 自定义按钮请使用插槽，甚至公共搜索也可以使用具名插槽渲染，参见文档 -->
        <TableHeader :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('user.user.quick Search Fields') })">
        </TableHeader>

        <!-- 表格 -->
        <!-- 表格列有多种自定义渲染方式，比如自定义组件、具名插槽等，参见文档 -->
        <!-- 要使用 el-table 组件原有的属性，直接加在 Table 标签上即可 -->
        <Table ref="tableRef" @clickp="clickps"></Table>

        <!-- 表单 -->
        <PopupForm />
        <el-dialog v-model="centerDialogVisible" title="重置成功" width="500" center>
            <span>
                重置后的密码： {{ psdnum }}
            </span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="centerDialogVisible = false">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog v-model="changDialogVisible" title="余额管理" width="500" center>
            <FormItem label="当前余额" type="number" v-model="userlist.money"
                        :input-attr="{ clearable: true, size: 'large', disabled: true }" />
                        <FormItem label="变更类型" type="select" v-model="ruleForm.type" v-if="userlist.group.name == '用户'"
                        :data="{ content: { '0': '投注', '1': '充值', '2': '系统', '3': '奖金', '4': '佣金', '5': '提现' } }" />
                    <FormItem label="变更类型" type="select" v-model="ruleForm.type" v-else
                        :data="{ content: { '1': '出票', '2': '充值', '3': '推广', '4': '店主跟单', '5': '玩家发单', '6': '平台跟单', '8': '红包', '9': '提现' } }" />
                    <FormItem label="变更数额" type="number" min="0" v-model="ruleForm.money"
                        :input-attr="{ min:0,clearable: true, size: 'large', }" />
               
                        <!-- <FormItem label="来源" type="string" v-model="ruleForm.source" size="large" 
                        placeholder="请输入来源内容！！！！！">
                        </FormItem> -->
                        <FormItem label="备注" type="string" v-model="ruleForm.remark" size="large" 
                        placeholder="请输入备注内容！！！！！">
                    </FormItem>
            <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="changdialogclose()">关闭</el-button>
                        <el-button @click="onSubmit()" type="primary">
                            确认
                        </el-button>
                    </div>
                </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import PopupForm from './popupForm.vue'
import { baTableApi } from '/@/api/common'
import { defaultOptButtons } from '/@/components/table'
import TableHeader from '/@/components/table/header/index.vue'
import Table from '/@/components/table/index.vue'
import baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import { fa } from 'element-plus/es/locale'
import { ElMessage } from 'element-plus'
import {postchangmoney} from '/@/api/backend/user/group'
import number from '/@/lang/backend/en/transaction/number'
import { min } from 'lodash-es'

defineOptions({
    name: 'user/user',
})
const { t } = useI18n()
const tableRef = ref()
const formRef = ref<FormInstance>()
var ruleForm = reactive({
    money: '',
    type: '',
    remark: '',
    userId:''
})

const onSubmit = () => {
   if(ruleForm.money=="" || ruleForm.type=="" || ruleForm.remark==""){
    ElMessage({
    message: '请输入要修改的内容！！！！',
    type: 'error'
  })
   }else{
    if(ruleForm.money==0){
        ElMessage({
    message: '变更数额不能为0',
    type: 'error'
  })
    }else if(Number(userlist.money)+Number(ruleForm.money).toFixed(2)*100<0){
        ElMessage({
    message: '变更数额不能大于当前余额',
    type: 'error'
  })
    }
    else{
        ruleForm.money=Number(ruleForm.money).toFixed(2)
        ruleForm.userId=userlist.id
        postchangmoney(ruleForm).then((res)=>{
            console.log(res)
            if(res.code==1){
                ElMessage({
                message: '修改成功！！！！',
                 type: 'success'
                })
                changDialogVisible.value=false
                ruleForm.money=""
                ruleForm.type=""
                ruleForm.remark=""
                ruleForm.source=""
                ruleForm.userId=""
                baTable.getIndex()?.then(() => {
        baTable.initSort()
        baTable.dragSort()
    })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }
   }
}
const changdialogclose=()=>{
    changDialogVisible.value=false
                ruleForm.money=""
                ruleForm.type=""
                ruleForm.remark=""
                ruleForm.source=""
                ruleForm.userId=""
}

const optButtons: OptButton[] = defaultOptButtons(['edit', 'delete', 'psd'])
optButtons.push({
    render: 'tipButton',
    // name 是任意的
    name: 'layoutInfo',
    // title 是语言翻译 key
    title: '余额管理',
    text: '',
    type: 'primary',
    icon: 'fa fa-search-plus icon',
    disabledTip: false,
    click(row, field) {
        changDialogVisible.value = true;
        console.log(row)
        userlist = row
    },
})

const centerDialogVisible = ref(false)
const changDialogVisible = ref(false)
const psdnum = ref(0)
let userlist = reactive(null)
/**
 * baTable 内包含了表格的所有数据且数据具备响应性，然后通过 provide 注入给了后代组件
 */
const baTable = new baTableClass(
    new baTableApi('/admin/user.User/'),
    {
        pk: 'id',
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('user.user.id'), prop: 'id', align: 'center', width: 70, operator: 'RANGE', sortable: 'custom' },
            { label: t('user.user.shop_id'), prop: 'shop_id', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('user.user.group__name'), prop: 'group.name', align: 'center', render: 'tags', operator: false },
            { label: t('user.user.group__name'), prop: 'group_id', align: 'center', operator: 'FIND_IN_SET', show: false, comSearchRender: 'remoteSelect', remote: { pk: 'jz_user_group.id', field: 'name', remoteUrl: '/admin/user.Group/index', multiple: true } },
            { label: t('user.user.nickname'), prop: 'nickname', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('user.user.mobile'), prop: 'mobile', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('user.user.avatar'), prop: 'avatar', align: 'center', render: 'image', operator: false },
            { label: t('user.user.money'), prop: 'money', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('user.user.last_login_time'), prop: 'last_login_time', align: 'center', operator: 'RANGE', sortable: 'custom', width: 160 },
            { label: t('user.user.last_login_ip'), prop: 'last_login_ip', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('user.user.last_login_address'), prop: 'last_login_address', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('user.user.status'), prop: 'status', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('user.user.RealName'), prop: 'RealName', align: 'center', render: 'tag', operator: 'eq', sortable: false, replaceValue: { '0': t('user.user.RealName 0'), '1': t('user.user.RealName 1') } },
            { label: t('user.user.create_time'), prop: 'create_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM:ss' },
            { label: t('Operate'), align: 'center', width: 200, render: 'buttons', buttons: optButtons, operator: false },
        ],
        dblClickNotEditColumn: [undefined],
    },
    {
        defaultItems: { shop_id: 0, gender: '0', birthday: null, money: 0, score: 0, pushKey: null, sfz_name: null, sfz_id: null, RealName: '0' },
    }
)

provide('baTable', baTable)
const clickps = (val) => {
    console.log(val, 'fuzujian')
    centerDialogVisible.value = true
    psdnum.value = val
}
onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()?.then(() => {
        baTable.initSort()
        baTable.dragSort()
    })
})
</script>

<style scoped lang="scss"></style>
