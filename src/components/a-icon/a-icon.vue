<template>
  <text class="iconfont" :class="[`icon-${name}`]" :style="iconStyle"></text>
</template>

<script lang='ts' setup>
import { computed } from "vue"

  const props = defineProps({
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#707070'
    },
    size: {
      type: String,
      default: '16'
    },
    bold: {
      type: Boolean,
      default: false
    }
  })

  const iconStyle = computed(() => {
    return {
      color: props.color,
      fontSize: props.size + 'px',
      fontWeight: props.bold ? 'bold' : 'normal'
    }
  })
</script>

<style scoped lang='scss'>
</style>