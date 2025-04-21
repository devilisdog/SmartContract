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
                    <FormItem :label="t('shop.cooperation.log.type')" type="radio" v-model="baTable.form.items!.type" prop="type" :data="{ content: { '0': t('shop.cooperation.log.type 0'), '1': t('shop.cooperation.log.type 1') } }" :placeholder="t('Please select field', { field: t('shop.cooperation.log.type') })" />
                    <FormItem :label="t('shop.cooperation.log.state')" type="radio" v-model="baTable.form.items!.state" prop="state" :data="{ content: { '0': t('shop.cooperation.log.state 0'), '1': t('shop.cooperation.log.state 1'), '2': t('shop.cooperation.log.state 2') } }" :placeholder="t('Please select field', { field: t('shop.cooperation.log.state') })" />
                    <FormItem :label="t('shop.cooperation.log.MainStore_id')" type="number" prop="MainStore_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.MainStore_id" :placeholder="t('Please input field', { field: t('shop.cooperation.log.MainStore_id') })" />
                    <FormItem :label="t('shop.cooperation.log.BranchStore_id')" type="number" prop="BranchStore_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.BranchStore_id" :placeholder="t('Please input field', { field: t('shop.cooperation.log.BranchStore_id') })" />
                    <FormItem :label="t('shop.cooperation.log.AutomaticOrder')" type="switch" v-model="baTable.form.items!.AutomaticOrder" prop="AutomaticOrder" :data="{ content: { '0': t('shop.cooperation.log.AutomaticOrder 0'), '1': t('shop.cooperation.log.AutomaticOrder 1') } }" />
                    <FormItem :label="t('shop.cooperation.log.AutomaticOrderReceiving')" type="switch" v-model="baTable.form.items!.AutomaticOrderReceiving" prop="AutomaticOrderReceiving" :data="{ content: { '0': t('shop.cooperation.log.AutomaticOrderReceiving 0'), '1': t('shop.cooperation.log.AutomaticOrderReceiving 1') } }" />
                    <FormItem :label="t('shop.cooperation.log.money')" type="number" prop="money" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.money" :placeholder="t('Please input field', { field: t('shop.cooperation.log.money') })" />
                    <FormItem :label="t('shop.cooperation.log.before')" type="number" prop="before" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.before" :placeholder="t('Please input field', { field: t('shop.cooperation.log.before') })" />
                    <FormItem :label="t('shop.cooperation.log.after')" type="number" prop="after" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.after" :placeholder="t('Please input field', { field: t('shop.cooperation.log.after') })" />
                    <FormItem :label="t('shop.cooperation.log.memo')" type="string" v-model="baTable.form.items!.memo" prop="memo" :placeholder="t('Please input field', { field: t('shop.cooperation.log.memo') })" />
                    <FormItem :label="t('shop.cooperation.log.source')" type="string" v-model="baTable.form.items!.source" prop="source" :placeholder="t('Please input field', { field: t('shop.cooperation.log.source') })" />
                    <FormItem :label="t('shop.cooperation.log.game_id')" type="number" prop="game_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.game_id" :placeholder="t('Please input field', { field: t('shop.cooperation.log.game_id') })" />
                    <FormItem :label="t('shop.cooperation.log.gameCommission')" type="number" prop="gameCommission" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.gameCommission" :placeholder="t('Please input field', { field: t('shop.cooperation.log.gameCommission') })" />
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
    money: [buildValidatorData({ name: 'number', title: t('shop.cooperation.log.money') })],
    before: [buildValidatorData({ name: 'number', title: t('shop.cooperation.log.before') })],
    after: [buildValidatorData({ name: 'number', title: t('shop.cooperation.log.after') })],
    gameCommission: [buildValidatorData({ name: 'number', title: t('shop.cooperation.log.gameCommission') })],
    create_time: [buildValidatorData({ name: 'date', title: t('shop.cooperation.log.create_time') })],
})
</script>

<style scoped lang="scss"></style>
