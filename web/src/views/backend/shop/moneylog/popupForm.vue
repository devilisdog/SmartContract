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
                    <FormItem :label="t('shop.moneylog.type')" type="radio" v-model="baTable.form.items!.type" prop="type" :data="{ content: { '1': t('shop.moneylog.type 1'), '2': t('shop.moneylog.type 2'), '3': t('shop.moneylog.type 3'), '4': t('shop.moneylog.type 4'), '5': t('shop.moneylog.type 5'), '6': t('shop.moneylog.type 6'), '8': t('shop.moneylog.type 8'), '9': t('shop.moneylog.type 9') } }" :placeholder="t('Please select field', { field: t('shop.moneylog.type') })" />
                    <FormItem :label="t('shop.moneylog.shop_id')" type="number" prop="shop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.shop_id" :placeholder="t('Please input field', { field: t('shop.moneylog.shop_id') })" />
                    <FormItem :label="t('shop.moneylog.money')" type="number" prop="money" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.money" :placeholder="t('Please input field', { field: t('shop.moneylog.money') })" />
                    <FormItem :label="t('shop.moneylog.before')" type="number" prop="before" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.before" :placeholder="t('Please input field', { field: t('shop.moneylog.before') })" />
                    <FormItem :label="t('shop.moneylog.after')" type="number" prop="after" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.after" :placeholder="t('Please input field', { field: t('shop.moneylog.after') })" />
                    <FormItem :label="t('shop.moneylog.memo')" type="string" v-model="baTable.form.items!.memo" prop="memo" :placeholder="t('Please input field', { field: t('shop.moneylog.memo') })" />
                    <FormItem :label="t('shop.moneylog.source')" type="string" v-model="baTable.form.items!.source" prop="source" :placeholder="t('Please input field', { field: t('shop.moneylog.source') })" />
                    <FormItem :label="t('shop.moneylog.OrderNumber')" type="string" v-model="baTable.form.items!.OrderNumber" prop="OrderNumber" :placeholder="t('Please input field', { field: t('shop.moneylog.OrderNumber') })" />
                    <FormItem :label="t('shop.moneylog.PayNumber')" type="string" v-model="baTable.form.items!.PayNumber" prop="PayNumber" :placeholder="t('Please input field', { field: t('shop.moneylog.PayNumber') })" />
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
    money: [buildValidatorData({ name: 'number', title: t('shop.moneylog.money') })],
    before: [buildValidatorData({ name: 'number', title: t('shop.moneylog.before') })],
    after: [buildValidatorData({ name: 'number', title: t('shop.moneylog.after') })],
    create_time: [buildValidatorData({ name: 'date', title: t('shop.moneylog.create_time') })],
})
</script>

<style scoped lang="scss"></style>
