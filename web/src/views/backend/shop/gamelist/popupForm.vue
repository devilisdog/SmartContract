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
                    <FormItem :label="t('shop.gamelist.game_id')" type="remoteSelect" v-model="baTable.form.items!.game_id" prop="game_id" :input-attr="{ pk: 'jz_systems_gamelist.id', field: 'title', 'remote-url': '/admin/systems.Gamelist/index' }" :placeholder="t('Please select field', { field: t('shop.gamelist.game_id') })" />
                    <FormItem :label="t('shop.gamelist.shop_id')" type="number" prop="shop_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.shop_id" :placeholder="t('Please input field', { field: t('shop.gamelist.shop_id') })" />
                    <FormItem :label="t('shop.gamelist.gamestate')" type="radio" v-model="baTable.form.items!.gamestate" prop="gamestate" :data="{ content: { '0': t('shop.gamelist.gamestate 0'), '1': t('shop.gamelist.gamestate 1') } }" :placeholder="t('Please select field', { field: t('shop.gamelist.gamestate') })" />
                    <FormItem :label="t('shop.gamelist.MinBetAmount')" type="number" prop="MinBetAmount" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.MinBetAmount" :placeholder="t('Please input field', { field: t('shop.gamelist.MinBetAmount') })" />
                    <FormItem :label="t('shop.gamelist.advance')" type="number" prop="advance" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.advance" :placeholder="t('Please input field', { field: t('shop.gamelist.advance') })" />
                    <FormItem :label="t('shop.gamelist.isCooperation')" type="radio" v-model="baTable.form.items!.isCooperation" prop="isCooperation" :data="{ content: { '0': t('shop.gamelist.isCooperation 0'), '1': t('shop.gamelist.isCooperation 1') } }" :placeholder="t('Please select field', { field: t('shop.gamelist.isCooperation') })" />
                    <FormItem :label="t('shop.gamelist.Cooperation')" type="radio" v-model="baTable.form.items!.Cooperation" prop="Cooperation" :data="{ content: { '0': t('shop.gamelist.Cooperation 0'), '1': t('shop.gamelist.Cooperation 1') } }" :placeholder="t('Please select field', { field: t('shop.gamelist.Cooperation') })" />
                    <FormItem :label="t('shop.gamelist.AllowComplexPlay')" type="radio" v-model="baTable.form.items!.AllowComplexPlay" prop="AllowComplexPlay" :data="{ content: { '0': t('shop.gamelist.AllowComplexPlay 0'), '1': t('shop.gamelist.AllowComplexPlay 1') } }" :placeholder="t('Please select field', { field: t('shop.gamelist.AllowComplexPlay') })" />
                    <FormItem :label="t('shop.gamelist.Repeat')" type="radio" v-model="baTable.form.items!.Repeat" prop="Repeat" :data="{ content: { '0': t('shop.gamelist.Repeat 0'), '1': t('shop.gamelist.Repeat 1') } }" :placeholder="t('Please select field', { field: t('shop.gamelist.Repeat') })" />
                    <FormItem :label="t('shop.gamelist.BonusOptimization')" type="radio" v-model="baTable.form.items!.BonusOptimization" prop="BonusOptimization" :data="{ content: { '0': t('shop.gamelist.BonusOptimization 0'), '1': t('shop.gamelist.BonusOptimization 1') } }" :placeholder="t('Please select field', { field: t('shop.gamelist.BonusOptimization') })" />
                    <FormItem :label="t('shop.gamelist.Issuing_switch')" type="radio" v-model="baTable.form.items!.Issuing_switch" prop="Issuing_switch" :data="{ content: { '0': t('shop.gamelist.Issuing_switch 0'), '1': t('shop.gamelist.Issuing_switch 1') } }" :placeholder="t('Please select field', { field: t('shop.gamelist.Issuing_switch') })" />
                    <FormItem :label="t('shop.gamelist.status')" type="radio" v-model="baTable.form.items!.status" prop="status" :data="{ content: { '0': t('shop.gamelist.status 0'), '1': t('shop.gamelist.status 1') } }" :placeholder="t('Please select field', { field: t('shop.gamelist.status') })" />
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
    shop_id: [buildValidatorData({ name: 'number', title: t('shop.gamelist.shop_id') })],
    MinBetAmount: [buildValidatorData({ name: 'number', title: t('shop.gamelist.MinBetAmount') })],
    advance: [buildValidatorData({ name: 'number', title: t('shop.gamelist.advance') })],
    update_time: [buildValidatorData({ name: 'date', title: t('shop.gamelist.update_time') })],
    create_time: [buildValidatorData({ name: 'date', title: t('shop.gamelist.create_time') })],
})
</script>

<style scoped lang="scss"></style>
