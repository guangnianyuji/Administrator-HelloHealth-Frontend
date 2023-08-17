<template>
    <div
        class="school-center-layout"
        v-loading.fullscreen.lock="isLoading"
        element-loading-text="正在加载"
    />
</template>

<script setup>
import loading from '@/global/loading'
import {ref, watch} from "vue";

const isLoading = ref(false);
const isDisappearing = ref(false)
watch(loading._showLoading_DO_NOT_USE,(newLoading ,oldLoading)=>{
    if (newLoading) {
        isDisappearing.value = false;
        isLoading.value = true;
    } else {
        isDisappearing.value = true;
        setTimeout(() => {
            isLoading.value = newLoading;
            isDisappearing.value = false;
        }, 300)
    }
})

</script>