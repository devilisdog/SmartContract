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
                    <FormItem :label="t('layout.info.type')" type="select" v-model="baTable.form.items!.type" prop="type" :data="{ content: { video: 'type video', image: 'type image' } }" :placeholder="t('Please select field', { field: t('layout.info.type') })" />
                    <FormItem :label="t('layout.info.layout_id')" type="select" v-model="baTable.form.items!.layout_id" prop="layout_id" :data="{ content: { '1': 1, '2': 2 } }" :placeholder="t('Please select field', { field: t('layout.info.type') })" />
                    <FormItem :label="t('layout.info.source_url')" type="file" v-model="baTable.form.items!.source_url" prop="source_url" />
                    <FormItem :label="t('layout.info.clicked_url')" type="string" v-model="baTable.form.items!.clicked_url" prop="clicked_url" :placeholder="t('Please input field', { field: t('layout.info.clicked_url') })" />
                    <FormItem :label="t('layout.info.waite_time')" type="number" prop="waite_time" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.waite_time" :placeholder="t('Please input field', { field: t('layout.info.waite_time') })" />
                    <FormItem :label="t('layout.info.is_enable')" type="switch" v-model="baTable.form.items!.is_enable" prop="is_enable" />
                    <FormItem :label="t('layout.info.sort')" type="number" prop="sort" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.sort" :placeholder="t('Please input field', { field: t('layout.info.sort') })" />
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
    waite_time: [buildValidatorData({ name: 'number', title: t('layout.info.waite_time') })],
    layout_id: [buildValidatorData({ name: 'required', title: t('layout.info.sort') })],
    sort: [buildValidatorData({ name: 'number', title: t('layout.info.sort') })],
    create_time: [buildValidatorData({ name: 'date', title: t('layout.info.create_time') })],
    update_time: [buildValidatorData({ name: 'date', title: t('layout.info.update_time') })],
})
</script>

<style scoped lang="scss"></style>
