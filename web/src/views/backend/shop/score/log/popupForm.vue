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
                    <FormItem :label="t('shop.score.log.user_id')" type="number" prop="user_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.user_id" :placeholder="t('Please input field', { field: t('shop.score.log.user_id') })" />
                    <FormItem :label="t('shop.score.log.score')" type="number" prop="score" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.score" :placeholder="t('Please input field', { field: t('shop.score.log.score') })" />
                    <FormItem :label="t('shop.score.log.before')" type="number" prop="before" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.before" :placeholder="t('Please input field', { field: t('shop.score.log.before') })" />
                    <FormItem :label="t('shop.score.log.after')" type="number" prop="after" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.after" :placeholder="t('Please input field', { field: t('shop.score.log.after') })" />
                    <FormItem :label="t('shop.score.log.memo')" type="string" v-model="baTable.form.items!.memo" prop="memo" :placeholder="t('Please input field', { field: t('shop.score.log.memo') })" />
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
    user_id: [buildValidatorData({ name: 'number', title: t('shop.score.log.user_id') })],
    score: [buildValidatorData({ name: 'number', title: t('shop.score.log.score') })],
    before: [buildValidatorData({ name: 'number', title: t('shop.score.log.before') })],
    after: [buildValidatorData({ name: 'number', title: t('shop.score.log.after') })],
    create_time: [buildValidatorData({ name: 'date', title: t('shop.score.log.create_time') })],
})
</script>

<style scoped lang="scss"></style>
