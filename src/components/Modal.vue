<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
        <button class="modal-close" @click="$emit('close')">×</button>
        <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "Modal",
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 25px;
    border-radius: 8px;
    min-width: 300px;
    max-width: 90%;
    position: relative;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: transparent;
    font-size: 24px;
    cursor: pointer;
}
</style>