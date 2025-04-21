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
                    <FormItem :label="t('shop.redpacket.shop_id')" type="number" prop="shop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.shop_id" :placeholder="t('Please input field', { field: t('shop.redpacket.shop_id') })" />
                    <FormItem :label="t('shop.redpacket.type')" type="radio" v-model="baTable.form.items!.type" prop="type" :data="{ content: { '1': t('shop.redpacket.type 1'), '2': t('shop.redpacket.type 2') } }" :placeholder="t('Please select field', { field: t('shop.redpacket.type') })" />
                    <FormItem :label="t('shop.redpacket.state')" type="radio" v-model="baTable.form.items!.state" prop="state" :data="{ content: { '1': t('shop.redpacket.state 1'), '2': t('shop.redpacket.state 2'), '3': t('shop.redpacket.state 3'), '4': t('shop.redpacket.state 4') } }" :placeholder="t('Please select field', { field: t('shop.redpacket.state') })" />
                    <FormItem :label="t('shop.redpacket.count')" type="number" prop="count" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.count" :placeholder="t('Please input field', { field: t('shop.redpacket.count') })" />
                    <FormItem :label="t('shop.redpacket.money')" type="number" prop="money" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.money" :placeholder="t('Please input field', { field: t('shop.redpacket.money') })" />
                    <FormItem :label="t('shop.redpacket.money_array')" type="string" v-model="baTable.form.items!.money_array" prop="money_array" :placeholder="t('Please input field', { field: t('shop.redpacket.money_array') })" />
                    <FormItem :label="t('shop.redpacket.title')" type="string" v-model="baTable.form.items!.title" prop="title" :placeholder="t('Please input field', { field: t('shop.redpacket.title') })" />
                    <FormItem :label="t('shop.redpacket.endtime')" type="datetime" v-model="baTable.form.items!.endtime" prop="endtime" :placeholder="t('Please select field', { field: t('shop.redpacket.endtime') })" />
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
    count: [buildValidatorData({ name: 'number', title: t('shop.redpacket.count') })],
    money: [buildValidatorData({ name: 'number', title: t('shop.redpacket.money') })],
    endtime: [buildValidatorData({ name: 'date', title: t('shop.redpacket.endtime') })],
    create_time: [buildValidatorData({ name: 'date', title: t('shop.redpacket.create_time') })],
})
</script>

<style scoped lang="scss"></style>
