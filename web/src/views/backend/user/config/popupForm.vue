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
                    <FormItem :label="t('user.config.user_id')" type="number" prop="user_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.user_id" :placeholder="t('Please input field', { field: t('user.config.user_id') })" />
                    <FormItem :label="t('user.config.remarks')" type="string" v-model="baTable.form.items!.remarks" prop="remarks" :placeholder="t('Please input field', { field: t('user.config.remarks') })" />
                    <FormItem :label="t('user.config.sale')" type="switch" v-model="baTable.form.items!.sale" prop="sale" :data="{ content: { '0': t('user.config.sale 0'), '1': t('user.config.sale 1') } }" />
                    <FormItem :label="t('user.config.expert')" type="switch" v-model="baTable.form.items!.expert" prop="expert" :data="{ content: { '0': t('user.config.expert 0'), '1': t('user.config.expert 1') } }" />
                    <FormItem :label="t('user.config.Star')" type="switch" v-model="baTable.form.items!.Star" prop="Star" :data="{ content: { '0': t('user.config.Star 0'), '1': t('user.config.Star 1') } }" />
                    <FormItem :label="t('user.config.followWink')" type="string" v-model="baTable.form.items!.followWink" prop="followWink" :placeholder="t('Please input field', { field: t('user.config.followWink') })" />
                    <FormItem :label="t('user.config.followFans')" type="string" v-model="baTable.form.items!.followFans" prop="followFans" :placeholder="t('Please input field', { field: t('user.config.followFans') })" />
                    <FormItem :label="t('user.config.ShopWink')" type="string" v-model="baTable.form.items!.ShopWink" prop="ShopWink" :placeholder="t('Please input field', { field: t('user.config.ShopWink') })" />
                    <FormItem :label="t('user.config.Inviter')" type="number" prop="Inviter" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.Inviter" :placeholder="t('Please input field', { field: t('user.config.Inviter') })" />
                    <FormItem :label="t('user.config.Alipay_userId')" type="string" v-model="baTable.form.items!.Alipay_userId" prop="Alipay_userId" :placeholder="t('Please input field', { field: t('user.config.Alipay_userId') })" />
                    <FormItem :label="t('user.config.Alipay_access_token')" type="string" v-model="baTable.form.items!.Alipay_access_token" prop="Alipay_access_token" :placeholder="t('Please input field', { field: t('user.config.Alipay_access_token') })" />
                    <FormItem :label="t('user.config.Alipay_refresh_token')" type="string" v-model="baTable.form.items!.Alipay_refresh_token" prop="Alipay_refresh_token" :placeholder="t('Please input field', { field: t('user.config.Alipay_refresh_token') })" />
                    <FormItem :label="t('user.config.AdaPay_Token_no')" type="string" v-model="baTable.form.items!.AdaPay_Token_no" prop="AdaPay_Token_no" :placeholder="t('Please input field', { field: t('user.config.AdaPay_Token_no') })" />
                    <FormItem :label="t('user.config.member_id')" type="string" v-model="baTable.form.items!.member_id" prop="member_id" :placeholder="t('Please input field', { field: t('user.config.member_id') })" />
                    <FormItem :label="t('user.config.machine_type')" type="string" v-model="baTable.form.items!.machine_type" prop="machine_type" :placeholder="t('Please input field', { field: t('user.config.machine_type') })" />
                    <FormItem :label="t('user.config.robot')" type="switch" v-model="baTable.form.items!.robot" prop="robot" :data="{ content: { '0': t('user.config.expert 0'), '1': t('user.config.expert 1') } }" />
                    <FormItem :label="t('user.config.robot_enabled')" type="switch" v-model="baTable.form.items!.robot_enabled" prop="robot_enabled" :data="{ content: { '0': t('user.config.robot_enabled 0'), '1': t('user.config.robot_enabled 1') } }"  />
                    <FormItem :label="t('user.config.robot_follow_qty')" type="string" v-model="baTable.form.items!.robot_follow_qty" prop="robot_follow_qty" :placeholder="t('Please input field', { field: t('user.config.robot_follow_qty') })" />
                    <FormItem :label="t('user.config.robot_follow_multiple')" type="string" v-model="baTable.form.items!.robot_follow_multiple" prop="robot_follow_multiple" :placeholder="t('Please input field', { field: t('user.config.robot_follow_multiple') })" />
                    <FormItem :label="t('user.config.robot_follow_enabled')" type="switch" v-model="baTable.form.items!.robot_follow_enabled" prop="robot_follow_enabled" :data="{ content: { '0': t('user.config.robot_follow_enabled 0'), '1': t('user.config.robot_follow_enabled 1') } }"  />
                    <FormItem :label="t('user.config.isdaili')" type="switch" v-model="baTable.form.items!.agent" prop="agent" :data="{ content: { '0': t('user.config.isdaili 0'), '1': t('user.config.isdaili 1') } }" />
                    <FormItem :label="t('user.config.settle_days')" type="string" v-model="baTable.form.items!.settle_days" prop="settle_days" :placeholder="t('Please input field', { field: t('user.config.settle_days') })" />
                    <FormItem :label="t('user.config.rate')" type="string" v-model="baTable.form.items!.rate" prop="rate" :placeholder="t('Please input field', { field: t('user.config.rate') })" />
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
    user_id: [buildValidatorData({ name: 'number', title: t('user.config.user_id') })],
    Inviter: [buildValidatorData({ name: 'number', title: t('user.config.Inviter') })],
})
</script>

<style scoped lang="scss"></style>
