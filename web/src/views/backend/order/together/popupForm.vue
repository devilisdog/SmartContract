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
                    <FormItem :label="t('order.together.user_id')" type="number" prop="user_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.user_id" :placeholder="t('Please input field', { field: t('order.together.user_id') })" />
                    <FormItem :label="t('order.together.order_id')" type="number" prop="order_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.order_id" :placeholder="t('Please input field', { field: t('order.together.order_id') })" />
                    <FormItem :label="t('order.together.StartBetMoney')" type="number" prop="StartBetMoney" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.StartBetMoney" :placeholder="t('Please input field', { field: t('order.together.StartBetMoney') })" />
                    <FormItem :label="t('order.together.NumberShare')" type="number" prop="NumberShare" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.NumberShare" :placeholder="t('Please input field', { field: t('order.together.NumberShare') })" />
                    <FormItem :label="t('order.together.OneselftMoney')" type="number" prop="OneselftMoney" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.OneselftMoney" :placeholder="t('Please input field', { field: t('order.together.OneselftMoney') })" />
                    <FormItem :label="t('order.together.MyselfShare')" type="number" prop="MyselfShare" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.MyselfShare" :placeholder="t('Please input field', { field: t('order.together.MyselfShare') })" />
                    <FormItem :label="t('order.together.Commission')" type="number" prop="Commission" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.Commission" :placeholder="t('Please input field', { field: t('order.together.Commission') })" />
                    <FormItem :label="t('order.together.guarantee')" type="number" prop="guarantee" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.guarantee" :placeholder="t('Please input field', { field: t('order.together.guarantee') })" />
                    <FormItem :label="t('order.together.ForecastReward')" type="string" v-model="baTable.form.items!.ForecastReward" prop="ForecastReward" :placeholder="t('Please input field', { field: t('order.together.ForecastReward') })" />
                    <FormItem :label="t('order.together.Declaration')" type="textarea" v-model="baTable.form.items!.Declaration" prop="Declaration" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('order.together.Declaration') })" />
                    <FormItem :label="t('order.together.Isopen')" type="radio" v-model="baTable.form.items!.Isopen" prop="Isopen" :data="{ content: { '0': t('order.together.Isopen 0'), '1': t('order.together.Isopen 1') } }" :placeholder="t('Please select field', { field: t('order.together.Isopen') })" />
                    <FormItem :label="t('order.together.Issue')" type="radio" v-model="baTable.form.items!.Issue" prop="Issue" :data="{ content: { '0': t('order.together.Issue 0'), '1': t('order.together.Issue 1') } }" :placeholder="t('Please select field', { field: t('order.together.Issue') })" />
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
    user_id: [buildValidatorData({ name: 'number', title: t('order.together.user_id') })],
    order_id: [buildValidatorData({ name: 'number', title: t('order.together.order_id') })],
    StartBetMoney: [buildValidatorData({ name: 'float', title: t('order.together.StartBetMoney') }), buildValidatorData({ name: 'number', title: t('order.together.StartBetMoney') }), buildValidatorData({ name: 'integer', title: t('order.together.StartBetMoney') })],
    NumberShare: [buildValidatorData({ name: 'number', title: t('order.together.NumberShare') })],
    OneselftMoney: [buildValidatorData({ name: 'float', title: t('order.together.OneselftMoney') }), buildValidatorData({ name: 'integer', title: t('order.together.OneselftMoney') }), buildValidatorData({ name: 'number', title: t('order.together.OneselftMoney') })],
    MyselfShare: [buildValidatorData({ name: 'number', title: t('order.together.MyselfShare') })],
    Commission: [buildValidatorData({ name: 'float', title: t('order.together.Commission') }), buildValidatorData({ name: 'integer', title: t('order.together.Commission') }), buildValidatorData({ name: 'number', title: t('order.together.Commission') })],
    guarantee: [buildValidatorData({ name: 'number', title: t('order.together.guarantee') })],
    PayTime: [buildValidatorData({ name: 'date', title: t('order.together.PayTime') })],
})
</script>

<style scoped lang="scss"></style>
