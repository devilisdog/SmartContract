<template>
 
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <!-- 自定义按钮请使用插槽，甚至公共搜索也可以使用具名插槽渲染，参见文档 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('layout.info.quick Search Fields') })"
        ></TableHeader>

        <!-- 表格 -->
        <!-- 表格列有多种自定义渲染方式，比如自定义组件、具名插槽等，参见文档 -->
        <!-- 要使用 el-table 组件原有的属性，直接加在 Table 标签上即可 -->
        <Table ref="tableRef"></Table>

        <!-- 表单 -->
        <PopupForm />
    </div>
</template>

<script setup lang="ts">
import { onMounted, provide, inject, ref ,watch} from 'vue'
import { useI18n } from 'vue-i18n'
import PopupForm from './popupForm.vue'
import { baTableApi } from '/@/api/common'
import { defaultOptButtons } from '/@/components/table'
import TableHeader from '/@/components/table/header/index.vue'
import Table from '/@/components/table/index.vue'
import baTableClass from '/@/utils/baTable'

defineOptions({
name: 'layout/info',
})

const { t } = useI18n()
const Table_data = inject('baTable')

const tableRef = ref()
const optButtons: OptButton[] = defaultOptButtons(['edit', 'delete'])

/**
* baTable 内包含了表格的所有数据且数据具备响应性，然后通过 provide 注入给了后代组件
*/
const baTable = new baTableClass(
new baTableApi('/admin/layout.Info/'),
{
pk: 'id',
column: [
    { type: 'selection', align: 'center', operator: false },
    { label: t('layout.info.id'), prop: 'id', align: 'center', width: 70, operator: 'RANGE', sortable: 'custom' },
    { label: t('layout.info.type'), prop: 'type', align: 'center', render: 'tag', operator: 'eq', sortable: false, replaceValue: { video: 'type video', image: 'type image' } },
    { label: t('layout.info.layout_id'), prop: 'layout_id', align: 'center', render: 'tag', operator: 'eq', sortable: false, replaceValue: { 1: '1', 2: '2' } },
    { label: t('layout.info.source_url'), prop: 'source_url', align: 'center', render: 'image', operator: false },
    { label: t('layout.info.clicked_url'), prop: 'clicked_url', align: 'center', operator: false, sortable: false },
    { label: t('layout.info.waite_time'), prop: 'waite_time', align: 'center', operator: 'RANGE', sortable: false },
    { label: t('layout.info.is_enable'), prop: 'is_enable',align: 'center',render: 'switch',operator: 'eq', sortable: false, replaceValue: { '0': t('layout.info.is_enable 0'), '1': t('layout.info.is_enable 1') }},
    { label: t('layout.info.sort'), prop: 'sort', align: 'center', operator: 'RANGE', sortable: 'custom' },
    { label: t('layout.info.create_time'), prop: 'create_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM:ss' },
    { label: t('layout.info.update_time'), prop: 'update_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM:ss' },
    { label: t('Operate'), align: 'center', width: 100, render: 'buttons', buttons: optButtons, operator: false },
],
dblClickNotEditColumn: [undefined, 'is_enable'],
},
{
defaultItems: { type: 'image', source_url: null, clicked_url: null, waite_time: 0, sort: 0 },
}
)


provide('baTable', baTable)

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
