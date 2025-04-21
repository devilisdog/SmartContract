<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <!-- 自定义按钮请使用插槽，甚至公共搜索也可以使用具名插槽渲染，参见文档 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('systems.gamelist.quick Search Fields') })"
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
    name: 'systems/gamelist',
})

const { t } = useI18n()
const tableRef = ref()
const optButtons: OptButton[] = defaultOptButtons(['edit', 'delete'])

/**
 * baTable 内包含了表格的所有数据且数据具备响应性，然后通过 provide 注入给了后代组件
 */
const baTable = new baTableClass(
    new baTableApi('/admin/systems.Gamelist/'),
    {
        pk: 'id',
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('systems.gamelist.id'), prop: 'id', align: 'center', width: 70, operator: 'RANGE', sortable: 'custom' },
            { label: t('systems.gamelist.state'), prop: 'state', align: 'center', render: 'switch', operator: 'eq', sortable: false, replaceValue: { '0': t('systems.gamelist.state 0'), '1': t('systems.gamelist.state 1') } },
            { label: t('systems.gamelist.type'), prop: 'type', align: 'center', render: 'tags', operator: 'eq', sortable: false, replaceValue: { '0': t('systems.gamelist.type 0'), '1': t('systems.gamelist.type 1') } },
            { label: t('systems.gamelist.Issue_no'), prop: 'Issue_no', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('systems.gamelist.title'), prop: 'title', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('systems.gamelist.subtitle'), prop: 'subtitle', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('systems.gamelist.advance'), prop: 'advance', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('systems.gamelist.MinBetAmount'), prop: 'MinBetAmount', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('systems.gamelist.MaxBetAmount'), prop: 'MaxBetAmount', align: 'center', operator: 'RANGE', sortable: false },
            { label: t('systems.gamelist.url'), prop: 'url', align: 'center', operatorPlaceholder: t('Fuzzy query'), render: 'url', operator: 'LIKE', sortable: false },
            { label: t('systems.gamelist.image'), prop: 'image', align: 'center', render: 'image', operator: false },
            { label: t('Operate'), align: 'center', width: 100, render: 'buttons', buttons: optButtons, operator: false },
        ],
        dblClickNotEditColumn: [undefined, 'state', 'TickOrderImg', 'Cooperation', 'AllowComplexPlay', 'Repeat', 'BonusOptimization', 'Issuing_switch'],
        defaultOrder: { prop: 'id', order: 'asc' },
    },
    {
        defaultItems: { type: '0', Issue_no: 0, advance: 10, MinBetAmount: 0, MaxBetAmount: 0, Issuing_switch: '1', TickOrderCount: 0 },
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
