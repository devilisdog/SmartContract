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
                    <FormItem :label="t('systems.feedback.status')" type="radio" v-model="baTable.form.items!.status" prop="status" :data="{ content: { '0': t('systems.feedback.status 0'), '1': t('systems.feedback.status 1') } }" :placeholder="t('Please select field', { field: t('systems.feedback.status') })" />
                    <FormItem :label="t('systems.feedback.user_id')" type="number" prop="user_id" :input-attr="{ step: 1 }" v-model.number="baTable.form.items!.user_id" :placeholder="t('Please input field', { field: t('systems.feedback.user_id') })" />
                    <FormItem :label="t('systems.feedback.type')" type="radio" v-model="baTable.form.items!.type" prop="type" :data="{ content: { '0': t('systems.feedback.type 0'), '1': t('systems.feedback.type 1'), '2': t('systems.feedback.type 2') } }" :placeholder="t('Please select field', { field: t('systems.feedback.type') })" />
                    <FormItem :label="t('systems.feedback.contact')" type="string" v-model="baTable.form.items!.contact" prop="contact" :placeholder="t('Please input field', { field: t('systems.feedback.contact') })" />
                    <FormItem :label="t('systems.feedback.describe')" type="editor" v-model="baTable.form.items!.describe" prop="describe" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('systems.feedback.describe') })" />
                    <FormItem :label="t('systems.feedback.related_images')" type="image" v-model="baTable.form.items!.related_images" prop="related_images" />
                    <FormItem :label="t('systems.feedback.returnData')" type="editor" v-model="baTable.form.items!.returnData" prop="returnData" @keyup.enter.stop="" @keyup.ctrl.enter="baTable.onSubmit(formRef)" :placeholder="t('Please input field', { field: t('systems.feedback.returnData') })" />
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
    user_id: [buildValidatorData({ name: 'number', title: t('systems.feedback.user_id') })],
    describe: [buildValidatorData({ name: 'editorRequired', title: t('systems.feedback.describe') })],
    create_time: [buildValidatorData({ name: 'date', title: t('systems.feedback.create_time') })],
    update_time: [buildValidatorData({ name: 'date', title: t('systems.feedback.update_time') })],
})
</script>

<style scoped lang="scss"></style>
