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
                    <FormItem :label="t('systems.gamelist.state')" type="switch" v-model="baTable.form.items!.state" prop="state" :data="{ content: { '0': t('systems.gamelist.state 0'), '1': t('systems.gamelist.state 1') } }" />
                    <FormItem :label="t('systems.gamelist.type')" type="radio" v-model="baTable.form.items!.type" prop="type" :data="{ content: { '0': t('systems.gamelist.type 0'), '1': t('systems.gamelist.type 1') } }" :placeholder="t('Please select field', { field: t('systems.gamelist.type') })" />
                    <FormItem :label="t('systems.gamelist.Issue_no')" type="number" prop="Issue_no" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.Issue_no" :placeholder="t('Please input field', { field: t('systems.gamelist.Issue_no') })" />
                    <FormItem :label="t('systems.gamelist.title')" type="string" v-model="baTable.form.items!.title" prop="title" :placeholder="t('Please input field', { field: t('systems.gamelist.title') })" />
                    <FormItem :label="t('systems.gamelist.subtitle')" type="string" v-model="baTable.form.items!.subtitle" prop="subtitle" :placeholder="t('Please input field', { field: t('systems.gamelist.subtitle') })" />
                    <FormItem :label="t('systems.gamelist.advance')" type="number" prop="advance" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.advance" :placeholder="t('Please input field', { field: t('systems.gamelist.advance') })" />
                    <FormItem :label="t('systems.gamelist.MinBetAmount')" type="number" prop="MinBetAmount" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.MinBetAmount" :placeholder="t('Please input field', { field: t('systems.gamelist.MinBetAmount') })" />
                    <FormItem :label="t('systems.gamelist.MaxBetAmount')" type="number" prop="MaxBetAmount" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.MaxBetAmount" :placeholder="t('Please input field', { field: t('systems.gamelist.MaxBetAmount') })" />
                    <FormItem :label="t('systems.gamelist.TickOrderImg')" type="switch" v-model="baTable.form.items!.TickOrderImg" prop="TickOrderImg" :data="{ content: { '0': t('systems.gamelist.TickOrderImg 0'), '1': t('systems.gamelist.TickOrderImg 1') } }" />
                    <FormItem :label="t('systems.gamelist.Cooperation')" type="switch" v-model="baTable.form.items!.Cooperation" prop="Cooperation" :data="{ content: { '0': t('systems.gamelist.Cooperation 0'), '1': t('systems.gamelist.Cooperation 1') } }" />
                    <FormItem :label="t('systems.gamelist.AllowComplexPlay')" type="switch" v-model="baTable.form.items!.AllowComplexPlay" prop="AllowComplexPlay" :data="{ content: { '0': t('systems.gamelist.AllowComplexPlay 0'), '1': t('systems.gamelist.AllowComplexPlay 1') } }" />
                    <FormItem :label="t('systems.gamelist.Repeat')" type="switch" v-model="baTable.form.items!.Repeat" prop="Repeat" :data="{ content: { '0': t('systems.gamelist.Repeat 0'), '1': t('systems.gamelist.Repeat 1') } }" />
                    <FormItem :label="t('systems.gamelist.BonusOptimization')" type="switch" v-model="baTable.form.items!.BonusOptimization" prop="BonusOptimization" :data="{ content: { '0': t('systems.gamelist.BonusOptimization 0'), '1': t('systems.gamelist.BonusOptimization 1') } }" />
                    <FormItem :label="t('systems.gamelist.Issuing_switch')" type="switch" v-model="baTable.form.items!.Issuing_switch" prop="Issuing_switch" :data="{ content: { '0': t('systems.gamelist.Issuing_switch 0'), '1': t('systems.gamelist.Issuing_switch 1') } }" />
                    <FormItem :label="t('systems.gamelist.TickOrderCount')" type="number" prop="TickOrderCount" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.TickOrderCount" :placeholder="t('Please input field', { field: t('systems.gamelist.TickOrderCount') })" />
                    <FormItem :label="t('systems.gamelist.url')" type="string" v-model="baTable.form.items!.url" prop="url" :placeholder="t('Please input field', { field: t('systems.gamelist.url') })" />
                    <FormItem :label="t('systems.gamelist.image')" type="image" v-model="baTable.form.items!.image" prop="image" />
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
    Issue_no: [buildValidatorData({ name: 'number', title: t('systems.gamelist.Issue_no') })],
    advance: [buildValidatorData({ name: 'number', title: t('systems.gamelist.advance') })],
    MinBetAmount: [buildValidatorData({ name: 'number', title: t('systems.gamelist.MinBetAmount') })],
    MaxBetAmount: [buildValidatorData({ name: 'number', title: t('systems.gamelist.MaxBetAmount') })],
    TickOrderCount: [buildValidatorData({ name: 'number', title: t('systems.gamelist.TickOrderCount') })],
    update_time: [buildValidatorData({ name: 'date', title: t('systems.gamelist.update_time') })],
    create_time: [buildValidatorData({ name: 'date', title: t('systems.gamelist.create_time') })],
})
</script>

<style scoped lang="scss"></style>
