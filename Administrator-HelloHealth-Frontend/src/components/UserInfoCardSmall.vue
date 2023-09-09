<script setup>
import globalData from "@/global/global";

const props = defineProps({
    avatarUrl: String,
    userName: String,
    userId: Number
})

const goToUserInfoPage = () =>{
    window.open(`${globalData.userWebsite}/user/${props.userId}`)
}
</script>

<template>
        <span class="wrapper" @click="goToUserInfoPage">
            <img :src="avatarUrl" alt="" />
            <span class="buttonTxt">
                {{userName}}
            </span>
        </span>
</template>

<style scoped>
.wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    position: relative;
    height: 2em;
}

.wrapper:hover{
    opacity: 0.8;
}

.wrapper:active{
    opacity: 0.9;
}

.wrapper img{
    height: 1.8em;
    width: 1.8em;
    border-radius: 50%;
    margin-right: 5px;
}
</style>