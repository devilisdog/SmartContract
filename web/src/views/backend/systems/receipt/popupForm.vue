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
                    <FormItem :label="t('systems.receipt.name')" type="string" v-model="baTable.form.items!.name" prop="name" :placeholder="t('Please input field', { field: t('systems.receipt.name') })" />
                    <FormItem :label="t('systems.receipt.title')" type="string" v-model="baTable.form.items!.title" prop="title" :placeholder="t('Please input field', { field: t('systems.receipt.title') })" />
                    <FormItem :label="t('systems.receipt.rate')" type="number" prop="rate" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.rate" :placeholder="t('Please input field', { field: t('systems.receipt.rate') })" />
                    <FormItem :label="t('systems.receipt.switch')" type="switch" v-model="baTable.form.items!.switch" prop="switch" :data="{ content: { '0': t('systems.receipt.switch 0'), '1': t('systems.receipt.switch 1') } }" />
                    <FormItem :label="t('systems.receipt.memo')" type="string" v-model="baTable.form.items!.memo" prop="memo" :placeholder="t('Please input field', { field: t('systems.receipt.memo') })" />
                    <FormItem :label="t('systems.receipt.icon')" type="string" v-model="baTable.form.items!.icon" prop="icon" :placeholder="t('Please input field', { field: t('systems.receipt.icon') })" />
                    <FormItem :label="t('systems.receipt.model')" type="editor" v-model="baTable.form.items!.model" prop="model" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('systems.receipt.model') })" />
                    <FormItem :label="t('systems.receipt.auth')" type="switch" v-model="baTable.form.items!.auth" prop="auth" :data="{ content: { '0': t('systems.receipt.auth 0'), '1': t('systems.receipt.auth 1') } }" />
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
    rate: [buildValidatorData({ name: 'float', title: t('systems.receipt.rate') })],
    model: [buildValidatorData({ name: 'editorRequired', title: t('systems.receipt.model') })],
})
</script>

<style scoped lang="scss"></style>
