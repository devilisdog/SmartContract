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
                    <FormItem :label="t('user.user.shop_id')" type="number" prop="shop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.shop_id" :placeholder="t('Please input field', { field: t('user.user.shop_id') })" />
                    <FormItem :label="t('user.user.group_id')" type="remoteSelects" v-model="baTable.form.items!.group_id" prop="group_id" :input-attr="{ pk: 'jz_user_group.id', field: 'name', 'remote-url': '/admin/user.Group/index' }" :placeholder="t('Please select field', { field: t('user.user.group_id') })" />
                    <FormItem :label="t('user.user.username')" type="string" v-model="baTable.form.items!.username" prop="username" :placeholder="t('Please input field', { field: t('user.user.username') })" />
                    <FormItem :label="t('user.user.nickname')" type="string" v-model="baTable.form.items!.nickname" prop="nickname" :placeholder="t('Please input field', { field: t('user.user.nickname') })" />
                    <FormItem :label="t('user.user.email')" type="string" v-model="baTable.form.items!.email" prop="email" :placeholder="t('Please input field', { field: t('user.user.email') })" />
                    <FormItem :label="t('user.user.mobile')" type="string" v-model="baTable.form.items!.mobile" prop="mobile" :placeholder="t('Please input field', { field: t('user.user.mobile') })" />
                    <FormItem :label="t('user.user.avatar')" type="image" v-model="baTable.form.items!.avatar" prop="avatar" />
                    <FormItem :label="t('user.user.gender')" type="radio" v-model="baTable.form.items!.gender" prop="gender" :data="{ content: { '0': t('user.user.gender 0'), '1': t('user.user.gender 1'), '2': t('user.user.gender 2') } }" :placeholder="t('Please select field', { field: t('user.user.gender') })" />
                    <FormItem :label="t('user.user.birthday')" type="date" v-model="baTable.form.items!.birthday" prop="birthday" :placeholder="t('Please select field', { field: t('user.user.birthday') })" />
<!--                    <FormItem :label="t('user.user.money')" type="number" prop="money" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.money" :placeholder="t('Please input field', { field: t('user.user.money') })" />-->
<!--                    <FormItem :label="t('user.user.score')" type="number" prop="score" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.score" :placeholder="t('Please input field', { field: t('user.user.score') })" />-->
                    <FormItem :label="t('user.user.motto')" type="string" v-model="baTable.form.items!.motto" prop="motto" :placeholder="t('Please input field', { field: t('user.user.motto') })" />
                    <FormItem :label="t('user.user.status')" type="string" v-model="baTable.form.items!.status" prop="status" :placeholder="t('Please input field', { field: t('user.user.status') })" />
                    <FormItem :label="t('user.user.pushKey')" type="string" v-model="baTable.form.items!.pushKey" prop="pushKey" :placeholder="t('Please input field', { field: t('user.user.pushKey') })" />
                    <FormItem :label="t('user.user.notice')" type="textarea" v-model="baTable.form.items!.notice" prop="notice" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('user.user.notice') })" />
                    <FormItem :label="t('user.user.sfz_name')" type="string" v-model="baTable.form.items!.sfz_name" prop="sfz_name" :placeholder="t('Please input field', { field: t('user.user.sfz_name') })" />
                    <FormItem :label="t('user.user.sfz_id')" type="string" v-model="baTable.form.items!.sfz_id" prop="sfz_id" :placeholder="t('Please input field', { field: t('user.user.sfz_id') })" />
                    <FormItem :label="t('user.user.RealName')" type="radio" v-model="baTable.form.items!.RealName" prop="RealName" :data="{ content: { '0': t('user.user.RealName 0'), '1': t('user.user.RealName 1') } }" :placeholder="t('Please select field', { field: t('user.user.RealName') })" />
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
    birthday: [buildValidatorData({ name: 'date', title: t('user.user.birthday') })],
    last_login_time: [buildValidatorData({ name: 'date', title: t('user.user.last_login_time') })],
    login_failure: [buildValidatorData({ name: 'number', title: t('user.user.login_failure') })],
    join_time: [buildValidatorData({ name: 'number', title: t('user.user.join_time') })],
    IsMock: [buildValidatorData({ name: 'number', title: t('user.user.IsMock') })],
    update_time: [buildValidatorData({ name: 'date', title: t('user.user.update_time') })],
    create_time: [buildValidatorData({ name: 'date', title: t('user.user.create_time') })],
})
</script>

<style scoped lang="scss"></style>
