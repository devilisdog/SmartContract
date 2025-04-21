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
                    <FormItem :label="t('shop.config.salesman')" type="number" prop="salesman" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.salesman" :placeholder="t('Please input field', { field: t('shop.config.salesman') })" />
                    <FormItem :label="t('shop.config.ServiceChargePercentage')" type="number" prop="ServiceChargePercentage" :input-attr="{ step: 0 }" v-model.number="baTable.form.items!.ServiceChargePercentage" :placeholder="t('Please input field', { field: t('shop.config.ServiceChargePercentage') })" />
                    <FormItem :label="t('shop.config.StoreCertification')" type="radio" v-model="baTable.form.items!.StoreCertification" prop="StoreCertification" :data="{ content: { '0': t('shop.config.StoreCertification 0'), '1': t('shop.config.StoreCertification 1'), '2': t('shop.config.StoreCertification 2'), '3': t('shop.config.StoreCertification 3') } }" :placeholder="t('Please select field', { field: t('shop.config.StoreCertification') })" />
                    <FormItem :label="t('shop.config.StoreCertificationMemo')" type="textarea" v-model="baTable.form.items!.StoreCertificationMemo" prop="StoreCertificationMemo" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.config.StoreCertificationMemo') })" />
                    <!--<FormItem :label="t('shop.config.StoreID')" type="textarea" v-model="baTable.form.items!.StoreID" prop="StoreID" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.config.StoreID') })" />-->
                   
                    <FormItem :label="t('shop.config.StoreID')" type="storeID" v-model="baTable.form.items" />
                    
                    

                    <FormItem :label="t('shop.config.address')" type="string" v-model="baTable.form.items!.address" prop="address" :placeholder="t('Please input field', { field: t('shop.config.address') })" />
                    <FormItem :label="t('shop.config.WeChat')" type="string" v-model="baTable.form.items!.WeChat" prop="WeChat" :placeholder="t('Please input field', { field: t('shop.config.WeChat') })" />
                    <FormItem :label="t('shop.config.Telephone')" type="string" v-model="baTable.form.items!.Telephone" prop="Telephone" :placeholder="t('Please input field', { field: t('shop.config.Telephone') })" />
                    <FormItem :label="t('shop.config.customerNum')" type="number" prop="customerNum" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.customerNum" :placeholder="t('Please input field', { field: t('shop.config.customerNum') })" />
                    <FormItem :label="t('shop.config.alipay_appId')" type="string" v-model="baTable.form.items!.alipay_appId" prop="alipay_appId" :placeholder="t('Please input field', { field: t('shop.config.alipay_appId') })" />
                    <FormItem :label="t('shop.config.alipay_merchantPrivateKey')" type="textarea" v-model="baTable.form.items!.alipay_merchantPrivateKey" prop="alipay_merchantPrivateKey" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.config.alipay_merchantPrivateKey') })" />
                    <FormItem :label="t('shop.config.alipay_alipayPublicKey')" type="textarea" v-model="baTable.form.items!.alipay_alipayPublicKey" prop="alipay_alipayPublicKey" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.config.alipay_alipayPublicKey') })" />
                    <FormItem :label="t('shop.config.machine_type')" type="textarea" v-model="baTable.form.items!.machine_type" prop="machine_type" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.config.machine_type') })" />
                    <FormItem :label="t('shop.config.isneedimgnumber')" type="number" prop="isneedimgnumber" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.isneedimgnumber" :placeholder="t('Please input field', { field: t('shop.config.isneedimgnumber') })" />
                    <FormItem :label="t('shop.config.RobotCertification')" type="radio" v-model="baTable.form.items!.robot_status" prop="robot_status" :data="{ content: { '0': t('shop.config.RobotCertification 0'), '1': t('shop.config.RobotCertification 1'), '2': t('shop.config.RobotCertification 2'), '3': t('shop.config.RobotCertification 3') } }" :placeholder="t('Please select field', { field: t('shop.config.StoreCertification') })" />
                    <FormItem :label="t('shop.config.Robot_enabledtype')" type="radio" v-model="baTable.form.items!.robot_enabled" prop="robot_enabled" :data="{ content: { '0': t('shop.config.Robot_enabledtype 0'), '1': t('shop.config.Robot_enabledtype 1') } }" :placeholder="t('Please select field', { field: t('shop.config.StoreCertification') })" /> 
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
    id: [buildValidatorData({ name: 'number', title: t('shop.config.id') })],
    salesman: [buildValidatorData({ name: 'number', title: t('shop.config.salesman') })],
    customerNum: [buildValidatorData({ name: 'number', title: t('shop.config.customerNum') })],
    isneedimgnumber: [buildValidatorData({ name: 'number', title: t('shop.config.isneedimgnumber') })],
    create_time: [buildValidatorData({ name: 'date', title: t('shop.config.create_time') })],
    update_time: [buildValidatorData({ name: 'date', title: t('shop.config.update_time') })],
})
</script>

<style scoped lang="scss"></style>
