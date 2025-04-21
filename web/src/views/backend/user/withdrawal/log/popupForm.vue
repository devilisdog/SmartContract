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
                    <FormItem :label="t('user.withdrawal.log.OrderNumber')" type="string" v-model="baTable.form.items!.OrderNumber" prop="OrderNumber" :placeholder="t('Please input field', { field: t('user.withdrawal.log.OrderNumber') })" />
                    <FormItem :label="t('user.withdrawal.log.type')" type="radio" v-model="baTable.form.items!.type" prop="type" :data="{ content: { '1': t('user.withdrawal.log.type 1'), '2': t('user.withdrawal.log.type 2'), '3': t('user.withdrawal.log.type 3') } }" :placeholder="t('Please select field', { field: t('user.withdrawal.log.type') })" />
                    <FormItem :label="t('user.withdrawal.log.state')" type="radio" v-model="baTable.form.items!.state" prop="state" :data="{ content: { '0': t('user.withdrawal.log.state 0'), '1': t('user.withdrawal.log.state 1'), '2': t('user.withdrawal.log.state 2'), '3': t('user.withdrawal.log.state 3') } }" :placeholder="t('Please select field', { field: t('user.withdrawal.log.state') })" />
                    <FormItem :label="t('user.withdrawal.log.user_id')" type="number" prop="user_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.user_id" :placeholder="t('Please input field', { field: t('user.withdrawal.log.user_id') })" />
                    <FormItem :label="t('user.withdrawal.log.shop_id')" type="number" prop="shop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.shop_id" :placeholder="t('Please input field', { field: t('user.withdrawal.log.shop_id') })" />
                    <FormItem :label="t('user.withdrawal.log.WithdrawalStore')" type="number" prop="WithdrawalStore" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.WithdrawalStore" :placeholder="t('Please input field', { field: t('user.withdrawal.log.WithdrawalStore') })" />
                    <FormItem :label="t('user.withdrawal.log.money')" type="number" prop="money" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.money" :placeholder="t('Please input field', { field: t('user.withdrawal.log.money') })" />
                    <FormItem :label="t('user.withdrawal.log.contact')" type="string" v-model="baTable.form.items!.contact" prop="contact" :placeholder="t('Please input field', { field: t('user.withdrawal.log.contact') })" />
                    <FormItem :label="t('user.withdrawal.log.number')" type="string" v-model="baTable.form.items!.number" prop="number" :placeholder="t('Please input field', { field: t('user.withdrawal.log.number') })" />
                    <FormItem :label="t('user.withdrawal.log.memo')" type="string" v-model="baTable.form.items!.memo" prop="memo" :placeholder="t('Please input field', { field: t('user.withdrawal.log.memo') })" />
                    <FormItem :label="t('user.withdrawal.log.retMemo')" type="textarea" v-model="baTable.form.items!.retMemo" prop="retMemo" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('user.withdrawal.log.retMemo') })" />
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
    user_id: [buildValidatorData({ name: 'number', title: t('user.withdrawal.log.user_id') })],
    shop_id: [buildValidatorData({ name: 'number', title: t('user.withdrawal.log.shop_id') })],
    WithdrawalStore: [buildValidatorData({ name: 'number', title: t('user.withdrawal.log.WithdrawalStore') })],
    create_time: [buildValidatorData({ name: 'date', title: t('user.withdrawal.log.create_time') })],
    update_time: [buildValidatorData({ name: 'date', title: t('user.withdrawal.log.update_time') })],
})
</script>

<style scoped lang="scss"></style>
