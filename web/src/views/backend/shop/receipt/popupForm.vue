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
                    <FormItem :label="t('shop.receipt.source')" type="remoteSelect" v-model="baTable.form.items!.source" prop="source" :input-attr="{ pk: 'jz_systems_receipt.id', field: 'name', 'remote-url': '/admin/systems.Receipt/index' }" :placeholder="t('Please select field', { field: t('shop.receipt.source') })" />
                    <FormItem :label="t('shop.receipt.shop_id')" type="number" prop="shop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.shop_id" :placeholder="t('Please input field', { field: t('shop.receipt.shop_id') })" />
                    <FormItem :label="t('shop.receipt.state')" type="radio" v-model="baTable.form.items!.state" prop="state" :data="{ content: { '0': t('shop.receipt.state 0'), '1': t('shop.receipt.state 1'), '2': t('shop.receipt.state 2'), '3': t('shop.receipt.state 3') } }" :placeholder="t('Please select field', { field: t('shop.receipt.state') })" />
                    <FormItem :label="t('shop.receipt.adapay_config')" type="textarea" v-model="baTable.form.items!.adapay_config" prop="adapay_config" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.receipt.adapay_config') })" />
                    <FormItem :label="t('shop.receipt.shopNum')" type="number" prop="shopNum" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.shopNum" :placeholder="t('Please input field', { field: t('shop.receipt.shopNum') })" />
                    <FormItem :label="t('shop.receipt.settleNum')" type="number" prop="settleNum" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.settleNum" :placeholder="t('Please input field', { field: t('shop.receipt.settleNum') })" />
                    <FormItem :label="t('shop.receipt.merchant_code')" type="string" v-model="baTable.form.items!.merchant_code" prop="merchant_code" :placeholder="t('Please input field', { field: t('shop.receipt.merchant_code') })" />
                    <FormItem :label="t('shop.receipt.mzf_newPay_config')" type="textarea" v-model="baTable.form.items!.mzf_newPay_config" prop="mzf_newPay_config" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.receipt.mzf_newPay_config') })" />
                    <FormItem :label="t('shop.receipt.ticai_SalesAgent')" type="image" v-model="baTable.form.items!.ticai_SalesAgent" prop="ticai_SalesAgent" />
                    <FormItem :label="t('shop.receipt.fucai_SalesAgent')" type="image" v-model="baTable.form.items!.fucai_SalesAgent" prop="fucai_SalesAgent" />
                    <FormItem :label="t('shop.receipt.shop_headImg')" type="image" v-model="baTable.form.items!.shop_headImg" prop="shop_headImg" />
                    <FormItem :label="t('shop.receipt.shop_indoorImg')" type="image" v-model="baTable.form.items!.shop_indoorImg" prop="shop_indoorImg" />
                    <FormItem :label="t('shop.receipt.identificationNumb')" type="textarea" v-model="baTable.form.items!.identificationNumb" prop="identificationNumb" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.receipt.identificationNumb') })" />
                    <FormItem :label="t('shop.receipt.identification_front')" type="image" v-model="baTable.form.items!.identification_front" prop="identification_front" />
                    <FormItem :label="t('shop.receipt.identification_reverse')" type="image" v-model="baTable.form.items!.identification_reverse" prop="identification_reverse" />
                    <FormItem :label="t('shop.receipt.hold_identification')" type="image" v-model="baTable.form.items!.hold_identification" prop="hold_identification" />
                    <FormItem :label="t('shop.receipt.identification_start')" type="string" v-model="baTable.form.items!.identification_start" prop="identification_start" :placeholder="t('Please input field', { field: t('shop.receipt.identification_start') })" />
                    <FormItem :label="t('shop.receipt.identification_end')" type="string" v-model="baTable.form.items!.identification_end" prop="identification_end" :placeholder="t('Please input field', { field: t('shop.receipt.identification_end') })" />
                    <FormItem :label="t('shop.receipt.identification_address')" type="string" v-model="baTable.form.items!.identification_address" prop="identification_address" :placeholder="t('Please input field', { field: t('shop.receipt.identification_address') })" />
                    <FormItem :label="t('shop.receipt.businessLicense_img')" type="image" v-model="baTable.form.items!.businessLicense_img" prop="businessLicense_img" />
                    <FormItem :label="t('shop.receipt.machine_identification')" type="image" v-model="baTable.form.items!.machine_identification" prop="machine_identification" />
                    <FormItem :label="t('shop.receipt.machine_SalesAgent')" type="image" v-model="baTable.form.items!.machine_SalesAgent" prop="machine_SalesAgent" />
                    <FormItem :label="t('shop.receipt.shop_location')" type="string" v-model="baTable.form.items!.shop_location" prop="shop_location" :placeholder="t('Please input field', { field: t('shop.receipt.shop_location') })" />
                    <FormItem :label="t('shop.receipt.shop_detailedAddress')" type="string" v-model="baTable.form.items!.shop_detailedAddress" prop="shop_detailedAddress" :placeholder="t('Please input field', { field: t('shop.receipt.shop_detailedAddress') })" />
                    <FormItem :label="t('shop.receipt.shop_fullName')" type="string" v-model="baTable.form.items!.shop_fullName" prop="shop_fullName" :placeholder="t('Please input field', { field: t('shop.receipt.shop_fullName') })" />
                    <FormItem :label="t('shop.receipt.shop_forShort')" type="string" v-model="baTable.form.items!.shop_forShort" prop="shop_forShort" :placeholder="t('Please input field', { field: t('shop.receipt.shop_forShort') })" />
                    <FormItem :label="t('shop.receipt.bankCard_num')" type="number" prop="bankCard_num" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.bankCard_num" :placeholder="t('Please input field', { field: t('shop.receipt.bankCard_num') })" />
                    <FormItem :label="t('shop.receipt.bank_number')" type="number" prop="bank_number" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.bank_number" :placeholder="t('Please input field', { field: t('shop.receipt.bank_number') })" />
                    <FormItem :label="t('shop.receipt.branch_bank')" type="string" v-model="baTable.form.items!.branch_bank" prop="branch_bank" :placeholder="t('Please input field', { field: t('shop.receipt.branch_bank') })" />
                    <FormItem :label="t('shop.receipt.xianxia_shoukuangImg')" type="image" v-model="baTable.form.items!.xianxia_shoukuangImg" prop="xianxia_shoukuangImg" />
                    <FormItem :label="t('shop.receipt.openingBank_address')" type="string" v-model="baTable.form.items!.openingBank_address" prop="openingBank_address" :placeholder="t('Please input field', { field: t('shop.receipt.openingBank_address') })" />
                    <FormItem :label="t('shop.receipt.bankCard_frontImg')" type="image" v-model="baTable.form.items!.bankCard_frontImg" prop="bankCard_frontImg" />
                    <FormItem :label="t('shop.receipt.email')" type="string" v-model="baTable.form.items!.email" prop="email" :placeholder="t('Please input field', { field: t('shop.receipt.email') })" />
                    <FormItem :label="t('shop.receipt.phone_number')" type="string" v-model="baTable.form.items!.phone_number" prop="phone_number" :placeholder="t('Please input field', { field: t('shop.receipt.phone_number') })" />
                    <FormItem :label="t('shop.receipt.name')" type="string" v-model="baTable.form.items!.name" prop="name" :placeholder="t('Please input field', { field: t('shop.receipt.name') })" />
                    <FormItem :label="t('shop.receipt.Alipay_account')" type="string" v-model="baTable.form.items!.Alipay_account" prop="Alipay_account" :placeholder="t('Please input field', { field: t('shop.receipt.Alipay_account') })" />
                    <FormItem :label="t('shop.receipt.Alipay_userId')" type="string" v-model="baTable.form.items!.alipay_appId" prop="alipay_appId" :placeholder="t('Please input field', { field: t('shop.receipt.Alipay_userId') })" />
                    <FormItem :label="t('shop.receipt.Alipay_access_token')" type="textarea" v-model="baTable.form.items!.alipay_merchantPrivateKey" prop="alipay_merchantPrivateKey" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.receipt.Alipay_access_token') })" />
                    <FormItem :label="t('shop.receipt.Alipay_refresh_token')" type="textarea" v-model="baTable.form.items!.alipay_alipayPublicKey" prop="alipay_alipayPublicKey" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.receipt.Alipay_refresh_token') })" />
                    <FormItem :label="t('shop.receipt.commission_num')" type="number" prop="commission_num" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.commission_num" :placeholder="t('Please input field', { field: t('shop.receipt.commission_num') })" />
                    <FormItem :label="t('shop.receipt.commission_startline')" type="string" v-model="baTable.form.items!.commission_startline" prop="commission_startline" :placeholder="t('Please input field', { field: t('shop.receipt.commission_startline') })" />
                    <FormItem :label="t('shop.receipt.commission_deadline')" type="string" v-model="baTable.form.items!.commission_deadline" prop="commission_deadline" :placeholder="t('Please input field', { field: t('shop.receipt.commission_deadline') })" />
                    <FormItem :label="t('shop.receipt.retmemo')" type="textarea" v-model="baTable.form.items!.retmemo" prop="retmemo" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.receipt.retmemo') })" />
                    <FormItem :label="t('shop.receipt.receipt_config')" type="textarea" v-model="baTable.form.items!.receipt_config" prop="receipt_config" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('shop.receipt.receipt_config') })" />
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
    shopNum: [buildValidatorData({ name: 'number', title: t('shop.receipt.shopNum') })],
    settleNum: [buildValidatorData({ name: 'number', title: t('shop.receipt.settleNum') })],
    bankCard_num: [buildValidatorData({ name: 'number', title: t('shop.receipt.bankCard_num') })],
    bank_number: [buildValidatorData({ name: 'number', title: t('shop.receipt.bank_number') })],
    commission_num: [buildValidatorData({ name: 'number', title: t('shop.receipt.commission_num') })],
    create_time: [buildValidatorData({ name: 'date', title: t('shop.receipt.create_time') })],
    update_time: [buildValidatorData({ name: 'date', title: t('shop.receipt.update_time') })],
})
</script>

<style scoped lang="scss"></style>
