<template>
    <!-- 对话框表单 -->
    <!-- 建议使用 Prettier 格式化代码 -->
    <!-- el-form 内可以混用 el-form-item、FormItem、ba-input 等输入组件 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        width="50%"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="config.layout.shrink ? '':'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    v-if="!baTable.form.loading"
                    ref="formRef"
                    @submit.prevent=""
                    @keyup.enter="baTable.onSubmit(formRef)"
                    :model="baTable.form.items"
                    :label-position="config.layout.shrink ? 'top' : 'right'"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                >
                    <FormItem :label="t('order.order.shop_id')" type="number" prop="shop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.shop_id" :placeholder="t('Please input field', { field: t('order.order.shop_id') })" />
                    <FormItem :label="t('order.order.user_id')" type="number" prop="user_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.user_id" :placeholder="t('Please input field', { field: t('order.order.user_id') })" />
                    <FormItem :label="t('order.order.default')" type="radio" v-model="baTable.form.items!.default" prop="default" :data="{ content: { '0': t('order.order.default 0'), '1': t('order.order.default 1'), '2': t('order.order.default 2'), '3': t('order.order.default 3') } }" :placeholder="t('Please select field', { field: t('order.order.default') })" />
                    <FormItem :label="t('order.order.State')" type="radio" v-model="baTable.form.items!.State" prop="State" :data="{ content: { '0': t('order.order.State 0'), '1': t('order.order.State 1'), '2': t('order.order.State 2'), '3': t('order.order.State 3'), '4': t('order.order.State 4'), '5': t('order.order.State 5'), '6': t('order.order.State 6'), '7': t('order.order.State 7'), '8': t('order.order.State 8'), '9': t('order.order.State 9'), '10': t('order.order.State 10'), '11': t('order.order.State 11') } }" :placeholder="t('Please select field', { field: t('order.order.State') })" />
                    <FormItem :label="t('order.order.issue_code')" type="string" v-model="baTable.form.items!.issue_code" prop="issue_code" :placeholder="t('Please input field', { field: t('order.order.issue_code') })" />
                    <FormItem :label="t('order.order.Note')" type="number" prop="Note" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.Note" :placeholder="t('Please input field', { field: t('order.order.Note') })" />
                    <FormItem :label="t('order.order.BetMoney')" type="number" prop="BetMoney" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.BetMoney" :placeholder="t('Please input field', { field: t('order.order.BetMoney') })" />
                    <FormItem :label="t('order.order.OrderAwardShop_id')" type="number" prop="OrderAwardShop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.OrderAwardShop_id" :placeholder="t('Please input field', { field: t('order.order.OrderAwardShop_id') })" />
                    <FormItem :label="t('order.order.OrderTicketingShop_id')" type="number" prop="OrderTicketingShop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.OrderTicketingShop_id" :placeholder="t('Please input field', { field: t('order.order.OrderTicketingShop_id') })" />
                    <FormItem :label="t('order.order.OrderReceivingShop_id')" type="number" prop="OrderReceivingShop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.OrderReceivingShop_id" :placeholder="t('Please input field', { field: t('order.order.OrderReceivingShop_id') })" />
                    <FormItem :label="t('order.order.Type')" type="radio" v-model="baTable.form.items!.Type" prop="Type" :data="{ content: { '0': t('order.order.Type 0'), '1': t('order.order.Type 1'), '2': t('order.order.Type 2'), '3': t('order.order.Type 3'), '4': t('order.order.Type 4'), '5': t('order.order.Type 5'), '6': t('order.order.Type 6'), '7': t('order.order.Type 7'), '8': t('order.order.Type 8'), '9': t('order.order.Type 9'), '10': t('order.order.Type 10'), '11': t('order.order.Type 11'), '12': t('order.order.Type 12'), '13': t('order.order.Type 13') } }" :placeholder="t('Please select field', { field: t('order.order.Type') })" />
                    <FormItem :label="t('order.order.BetContent')" type="textarea" v-model="baTable.form.items!.BetContent" prop="BetContent" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('order.order.BetContent') })" />
                    <FormItem :label="t('order.order.FollowContent')" type="textarea" v-model="baTable.form.items!.FollowContent" prop="FollowContent" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('order.order.FollowContent') })" />
                    <FormItem :label="t('order.order.WinningMoney')" type="number" prop="WinningMoney" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.WinningMoney" :placeholder="t('Please input field', { field: t('order.order.WinningMoney') })" />
                    <FormItem :label="t('order.order.ReturnImages')" type="images" v-model="baTable.form.items!.ReturnImages" prop="ReturnImages" />
                    <FormItem :label="t('order.order.bonusmin')" type="number" prop="bonusmin" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.bonusmin" :placeholder="t('Please input field', { field: t('order.order.bonusmin') })" />
                    <FormItem :label="t('order.order.bonusmax')" type="number" prop="bonusmax" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.bonusmax" :placeholder="t('Please input field', { field: t('order.order.bonusmax') })" />
                    <FormItem :label="t('order.order.Issue')" type="radio" v-model="baTable.form.items!.Issue" prop="Issue" :data="{ content: { '0': t('order.order.Issue 0'), '1': t('order.order.Issue 1'), '2': t('order.order.Issue 2') } }" :placeholder="t('Please select field', { field: t('order.order.Issue') })" />
                    <FormItem :label="t('order.order.follow_pid')" type="number" prop="follow_pid" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.follow_pid" :placeholder="t('Please input field', { field: t('order.order.follow_pid') })" />
                    <FormItem :label="t('order.order.PayTime')" type="datetime" v-model="baTable.form.items!.PayTime" prop="PayTime" :placeholder="t('Please select field', { field: t('order.order.PayTime') })" />
                    <FormItem :label="t('order.order.Deadline')" type="datetime" v-model="baTable.form.items!.Deadline" prop="Deadline" :placeholder="t('Please select field', { field: t('order.order.Deadline') })" />
                    <FormItem :label="t('order.order.drawDeadine')" type="datetime" v-model="baTable.form.items!.drawDeadine" prop="drawDeadine" :placeholder="t('Please select field', { field: t('order.order.drawDeadine') })" />
                    <FormItem :label="t('order.order.AwardMoney')" type="number" prop="AwardMoney" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.AwardMoney" :placeholder="t('Please input field', { field: t('order.order.AwardMoney') })" />
                    <FormItem :label="t('order.order.Awardtime')" type="datetime" v-model="baTable.form.items!.Awardtime" prop="Awardtime" :placeholder="t('Please select field', { field: t('order.order.Awardtime') })" />
                    <FormItem :label="t('order.order.Receivingtime')" type="datetime" v-model="baTable.form.items!.Receivingtime" prop="Receivingtime" :placeholder="t('Please select field', { field: t('order.order.Receivingtime') })" />
                    <FormItem :label="t('order.order.Ticketingtime')" type="datetime" v-model="baTable.form.items!.Ticketingtime" prop="Ticketingtime" :placeholder="t('Please select field', { field: t('order.order.Ticketingtime') })" />
                    <FormItem :label="t('order.order.WinConten')" type="textarea" v-model="baTable.form.items!.WinConten" prop="WinConten" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('order.order.WinConten') })" />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm()">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? t('Save and edit next item') : t('Save') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormItemRule } from 'element-plus'
import { inject, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormItem from '/@/components/formItem/index.vue'
import { useConfig } from '/@/stores/config'
import type baTableClass from '/@/utils/baTable'
import { buildValidatorData } from '/@/utils/validate'

const config = useConfig()
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const { t } = useI18n()

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    shop_id: [buildValidatorData({ name: 'number', title: t('order.order.shop_id') })],
    user_id: [buildValidatorData({ name: 'number', title: t('order.order.user_id') })],
    Note: [buildValidatorData({ name: 'number', title: t('order.order.Note') })],
    BetMoney: [buildValidatorData({ name: 'number', title: t('order.order.BetMoney') })],
    ascription: [buildValidatorData({ name: 'number', title: t('order.order.ascription') })],
    OrderAwardShop_id: [buildValidatorData({ name: 'number', title: t('order.order.OrderAwardShop_id') })],
    OrderTicketingShop_id: [buildValidatorData({ name: 'number', title: t('order.order.OrderTicketingShop_id') })],
    OrderReceivingShop_id: [buildValidatorData({ name: 'number', title: t('order.order.OrderReceivingShop_id') })],
    BetContent: [buildValidatorData({ name: 'editorRequired', title: t('order.order.BetContent') })],
    WinningMoney: [buildValidatorData({ name: 'number', title: t('order.order.WinningMoney') })],
    bonusmin: [buildValidatorData({ name: 'number', title: t('order.order.bonusmin') })],
    bonusmax: [buildValidatorData({ name: 'number', title: t('order.order.bonusmax') })],
    PayTime: [buildValidatorData({ name: 'date', title: t('order.order.PayTime') })],
    Deadline: [buildValidatorData({ name: 'date', title: t('order.order.Deadline') })],
    drawDeadine: [buildValidatorData({ name: 'date', title: t('order.order.drawDeadine') })],
    AwardMoney: [buildValidatorData({ name: 'number', title: t('order.order.AwardMoney') })],
    Awardtime: [buildValidatorData({ name: 'date', title: t('order.order.Awardtime') })],
    Receivingtime: [buildValidatorData({ name: 'date', title: t('order.order.Receivingtime') })],
    Ticketingtime: [buildValidatorData({ name: 'date', title: t('order.order.Ticketingtime') })],
    create_time: [buildValidatorData({ name: 'date', title: t('order.order.create_time') })],
})
</script>

<style scoped lang="scss"></style>
