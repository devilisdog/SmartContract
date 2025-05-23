<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <!-- 自定义按钮请使用插槽，甚至公共搜索也可以使用具名插槽渲染，参见文档 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('shop.gamelist.quick Search Fields') })"
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
import { onMounted, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PopupForm from './popupForm.vue'
import { baTableApi } from '/@/api/common'
import { defaultOptButtons } from '/@/components/table'
import TableHeader from '/@/components/table/header/index.vue'
import Table from '/@/components/table/index.vue'
import baTableClass from '/@/utils/baTable'

defineOptions({
    name: 'shop/gamelist',
})

const { t } = useI18n()
const tableRef = ref()
const optButtons: OptButton[] = defaultOptButtons(['edit', 'delete'])

/**
 * baTable 内包含了表格的所有数据且数据具备响应性，然后通过 provide 注入给了后代组件
 */
const baTable = new baTableClass(
    new baTableApi('/admin/shop.Gamelist/'),
    {
        pk: 'id',
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('shop.gamelist.id'), prop: 'id', align: 'center', width: 70, operator: 'RANGE', sortable: 'custom' },
            { label: t('shop.gamelist.game__title'), prop: 'game.title', align: 'center', operatorPlaceholder: t('Fuzzy query'), render: 'tags', operator: 'LIKE' },
            { label: t('shop.gamelist.shop_id'), prop: 'shop_id', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('shop.gamelist.gamestate'), prop: 'gamestate', align: 'center', render: 'tag', operator: 'eq', sortable: false, replaceValue: { '0': t('shop.gamelist.gamestate 0'), '1': t('shop.gamelist.gamestate 1') } },
            { label: t('shop.gamelist.MinBetAmount'), prop: 'MinBetAmount', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('shop.gamelist.advance'), prop: 'advance', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('shop.gamelist.isCooperation'), prop: 'isCooperation', align: 'center', render: 'switch', operator: 'eq', sortable: false, replaceValue: { '0': t('shop.gamelist.isCooperation 0'), '1': t('shop.gamelist.isCooperation 1') } },
            { label: t('shop.gamelist.Cooperation'), prop: 'Cooperation', align: 'center', render: 'switch', operator: 'eq', sortable: false, replaceValue: { '0': t('shop.gamelist.Cooperation 0'), '1': t('shop.gamelist.Cooperation 1') } },
            { label: t('shop.gamelist.AllowComplexPlay'), prop: 'AllowComplexPlay', align: 'center', render: 'switch', operator: 'eq', sortable: false, replaceValue: { '0': t('shop.gamelist.AllowComplexPlay 0'), '1': t('shop.gamelist.AllowComplexPlay 1') } },
            { label: t('shop.gamelist.Repeat'), prop: 'Repeat', align: 'center', render: 'switch', operator: 'eq', sortable: false, replaceValue: { '0': t('shop.gamelist.Repeat 0'), '1': t('shop.gamelist.Repeat 1') } },
            { label: t('shop.gamelist.BonusOptimization'), prop: 'BonusOptimization', align: 'center', render: 'switch', operator: 'eq', sortable: false, replaceValue: { '0': t('shop.gamelist.BonusOptimization 0'), '1': t('shop.gamelist.BonusOptimization 1') } },
            { label: t('shop.gamelist.Issuing_switch'), prop: 'Issuing_switch', align: 'center', render: 'switch', operator: 'eq', sortable: false, replaceValue: { '0': t('shop.gamelist.Issuing_switch 0'), '1': t('shop.gamelist.Issuing_switch 1') } },
            { label: t('shop.gamelist.status'), prop: 'status', align: 'center', render: 'switch', operator: 'eq', sortable: false, replaceValue: { '0': t('shop.gamelist.status 0'), '1': t('shop.gamelist.status 1') } },
            { label: t('shop.gamelist.update_time'), prop: 'update_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM:ss' },
            { label: t('shop.gamelist.create_time'), prop: 'create_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM:ss' },
            { label: t('Operate'), align: 'center', width: 100, render: 'buttons', buttons: optButtons, operator: false },
        ],
        dblClickNotEditColumn: [undefined],
    },
    {
        defaultItems: { shop_id: 0, gamestate: '0', MinBetAmount: 0, advance: 0, isCooperation: '0', Cooperation: '0', AllowComplexPlay: '0', Repeat: '0', BonusOptimization: '0', Issuing_switch: '0', status: '0' },
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
