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
                    <FormItem :label="t('order.follow.user_id')" type="number" prop="user_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.user_id" :placeholder="t('Please input field', { field: t('order.follow.user_id') })" />
                    <FormItem :label="t('order.follow.order_id')" type="number" prop="order_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.order_id" :placeholder="t('Please input field', { field: t('order.follow.order_id') })" />
                    <FormItem :label="t('order.follow.Type')" type="string" v-model="baTable.form.items!.Type" prop="Type" :placeholder="t('Please input field', { field: t('order.follow.Type') })" />
                    <FormItem :label="t('order.follow.StartBetMoney')" type="number" prop="StartBetMoney" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.StartBetMoney" :placeholder="t('Please input field', { field: t('order.follow.StartBetMoney') })" />
                    <FormItem :label="t('order.follow.OneselftMoney')" type="number" prop="OneselftMoney" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.OneselftMoney" :placeholder="t('Please input field', { field: t('order.follow.OneselftMoney') })" />
                    <FormItem :label="t('order.follow.Declarati')" type="textarea" v-model="baTable.form.items!.Declarati" prop="Declarati" :input-attr="{ rows: 3 }" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('order.follow.Declarati') })" />
                    <FormItem :label="t('order.follow.ForecastReward')" type="number" prop="ForecastReward" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.ForecastReward" :placeholder="t('Please input field', { field: t('order.follow.ForecastReward') })" />
                    <FormItem :label="t('order.follow.Isopen')" type="radio" v-model="baTable.form.items!.Isopen" prop="Isopen" :data="{ content: { '0': t('order.follow.Isopen 0'), '1': t('order.follow.Isopen 1') } }" :placeholder="t('Please select field', { field: t('order.follow.Isopen') })" />
                    <FormItem :label="t('order.follow.Deadline')" type="datetime" v-model="baTable.form.items!.Deadline" prop="Deadline" :placeholder="t('Please select field', { field: t('order.follow.Deadline') })" />
                    <FormItem :label="t('order.follow.FollowMoney')" type="number" prop="FollowMoney" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.FollowMoney" :placeholder="t('Please input field', { field: t('order.follow.FollowMoney') })" />
                    <FormItem :label="t('order.follow.popularity')" type="number" prop="popularity" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.popularity" :placeholder="t('Please input field', { field: t('order.follow.popularity') })" />
                    <FormItem :label="t('order.follow.condition')" type="radio" v-model="baTable.form.items!.condition" prop="condition" :data="{ content: { '0': t('order.follow.condition 0'), '1': t('order.follow.condition 1') } }" :placeholder="t('Please select field', { field: t('order.follow.condition') })" />
                    <FormItem :label="t('order.follow.show_hall')" type="radio" v-model="baTable.form.items!.show_hall" prop="show_hall" :data="{ content: { '0': t('order.follow.show_hall 0'), '1': t('order.follow.show_hall 1') } }" :placeholder="t('Please select field', { field: t('order.follow.show_hall') })" />
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
    user_id: [buildValidatorData({ name: 'number', title: t('order.follow.user_id') })],
    order_id: [buildValidatorData({ name: 'number', title: t('order.follow.order_id') })],
    StartBetMoney: [buildValidatorData({ name: 'number', title: t('order.follow.StartBetMoney') }), buildValidatorData({ name: 'float', title: t('order.follow.StartBetMoney') }), buildValidatorData({ name: 'integer', title: t('order.follow.StartBetMoney') })],
    OneselftMoney: [buildValidatorData({ name: 'number', title: t('order.follow.OneselftMoney') }), buildValidatorData({ name: 'integer', title: t('order.follow.OneselftMoney') }), buildValidatorData({ name: 'float', title: t('order.follow.OneselftMoney') })],
    ForecastReward: [buildValidatorData({ name: 'float', title: t('order.follow.ForecastReward') }), buildValidatorData({ name: 'number', title: t('order.follow.ForecastReward') }), buildValidatorData({ name: 'integer', title: t('order.follow.ForecastReward') })],
    Deadline: [buildValidatorData({ name: 'date', title: t('order.follow.Deadline') })],
    FollowMoney: [buildValidatorData({ name: 'float', title: t('order.follow.FollowMoney') })],
    popularity: [buildValidatorData({ name: 'number', title: t('order.follow.popularity') })],
})
</script>

<style scoped lang="scss"></style>
