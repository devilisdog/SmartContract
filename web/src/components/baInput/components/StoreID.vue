<template>
    <div class="scrollbar" v-if="state.value.length > 0 && state.value != null">
        <div class="imgList" v-show="state.flgtype == 'image'">
            <el-image v-for="items, indexs in state.value" :key="items.index"
                style="width: 100px; height: 100px; margin: 0.5rem;" :src="'https://admin.cai8cai8.top'+items.src"
                :zoom-rate="1.2" :preview-src-list="getsrclist()" :initial-index="initialIndex.value"
                @click="getinitialIndex(indexs)" fit="cover" />
        </div>
        <div class="imgList" v-show="state.flgtype == 'video'">
            <video width="320" height="320" controls>
                <source :src="state.value[0].src" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
        <!-- <el-button type="success" @click="GetStoreIDzip">导出资料</el-button> -->
    </div>
    <div v-else>
        无可用数据
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, watch, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { ElNotification } from 'element-plus'

    interface Props {
        modelValue : string
    }

    const param = reactive({
        StoreID: [],
    })

    const props = withDefaults(defineProps<Props>(), {
        modelValue: '',
    })

    const getsrclist = () => {
        state.value.forEach((item : any) => {
            param.StoreID.push('https://admin.cai8cai8.top' + item.src);
        });
        return param.StoreID
    }

    const initialIndex = ref(0)

    const getinitialIndex = (e) => {

        if (e != initialIndex.value) {
            initialIndex.value = e
        }
    }

    const state = reactive({
        value: props.modelValue.StoreID,
        flgtype: props.modelValue.StoreIDType
    })

    const GetStoreIDzip = () => {
        ElNotification({
            title: '提示',
            message: '功能待开发哈~',
            duration: 0,
        })
    }

    watch(
        () => props.modelValue,
        (newVal) => {
            state.value = newVal
        }
    )
</script>

<style scoped lang="scss">
    .scrollbar {
        width: 100%;
        height: 100%;
        flex-direction: column;
        margin-top: 1px;
    }

    .imgList {
        width: 60%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
