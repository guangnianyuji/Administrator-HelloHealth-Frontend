<script setup>

</script>

<template>
    <button class="cssbuttons-io-button">
        <slot></slot>
        <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill="currentColor"
                      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
            </svg>
        </span>
    </button>
</template>

<style scoped>
.cssbuttons-io-button {
    min-width: 100px;
    background: var(--el-color-primary);
    color: white;
    font-family: inherit;
    padding: 0em;
    padding-left: 1em;
    font-size: 13px;
    font-weight: 400;
    border-radius: 0.9em;
    border: none;
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    box-shadow: inset 0 0 1.6em -0.6em var(--el-color-primary);
    overflow: hidden;
    position: relative;
    height: 2.8em;
    padding-right: 3.1em;
}

.cssbuttons-io-button .icon {
    background: white;
    margin-left: 1em;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.2em;
    width: 2.2em;
    border-radius: 0.7em;
    box-shadow: 0.1em 0.1em 0.6em 0.2em var(--el-color-primary);
    right: 0.3em;
    transition: all 0.3s;
}

.cssbuttons-io-button:hover .icon {
    width: calc(100% - 0.6em);
}

.cssbuttons-io-button .icon svg {
    width: 1.1em;
    transition: transform 0.3s;
    color: var(--el-color-primary);
}

.cssbuttons-io-button:hover .icon svg {
    transform: translateX(0.1em);
}

.cssbuttons-io-button:active .icon {
    transform: scale(0.95);
}
</style>