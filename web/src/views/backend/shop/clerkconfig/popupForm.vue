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
                    <FormItem :label="t('shop.clerkconfig.state')" type="switch" v-model="baTable.form.items!.state" prop="state" :data="{ content: { '0': t('shop.clerkconfig.state 0'), '1': t('shop.clerkconfig.state 1') } }" />
                    <FormItem :label="t('shop.clerkconfig.user_id')" type="number" prop="user_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.user_id" :placeholder="t('Please input field', { field: t('shop.clerkconfig.user_id') })" />
                    <FormItem :label="t('shop.clerkconfig.gamelist')" type="textarea" v-model="baTable.form.items!.gamelist" prop="gamelist" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.clerkconfig.gamelist') })" />
                    <FormItem :label="t('shop.clerkconfig.remarks')" type="string" v-model="baTable.form.items!.remarks" prop="remarks" :placeholder="t('Please input field', { field: t('shop.clerkconfig.remarks') })" />
                    <FormItem :label="t('shop.clerkconfig.realName')" type="string" v-model="baTable.form.items!.realName" prop="realName" :placeholder="t('Please input field', { field: t('shop.clerkconfig.realName') })" />
                    <FormItem :label="t('shop.clerkconfig.sfz')" type="string" v-model="baTable.form.items!.sfz" prop="sfz" :placeholder="t('Please input field', { field: t('shop.clerkconfig.sfz') })" />
                    <FormItem :label="t('shop.clerkconfig.viewUserlist')" type="switch" v-model="baTable.form.items!.viewUserlist" prop="viewUserlist" :data="{ content: { '0': t('shop.clerkconfig.viewUserlist 0'), '1': t('shop.clerkconfig.viewUserlist 1') } }" />
                    <FormItem :label="t('shop.clerkconfig.award')" type="switch" v-model="baTable.form.items!.award" prop="award" :data="{ content: { '0': t('shop.clerkconfig.award 0'), '1': t('shop.clerkconfig.award 1') } }" />
                    <FormItem :label="t('shop.clerkconfig.cooperation')" type="switch" v-model="baTable.form.items!.cooperation" prop="cooperation" :data="{ content: { '0': t('shop.clerkconfig.cooperation 0'), '1': t('shop.clerkconfig.cooperation 1') } }" />
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
    create_time: [buildValidatorData({ name: 'date', title: t('shop.clerkconfig.create_time') })],
    update_time: [buildValidatorData({ name: 'date', title: t('shop.clerkconfig.update_time') })],
})
</script>

<style scoped lang="scss"></style>
