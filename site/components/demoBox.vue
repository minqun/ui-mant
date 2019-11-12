<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-14 16:46:51
 * @LastEditTime: 2019-10-14 17:45:05
 * @LastEditors: Please set LastEditors
 -->
<template>
  <section></section>
</template>
<script>
import animate from 'antd/_util/openAnimation';
import BaseMixin from 'antd/_util/BaseMixin';
export default {
  name: 'DemoBox',
  mixins: [BaseMixin],
  props: {
    jsfiddle: Object,
    isIframe: Boolean,
  },
  inject: {
    iframeDemo: { default: {} },
    demoContext: { default: {} },
  },
  data() {
    const { name = '' } = this.demoContext;
    const { us, cn, sourceCode } = this.jsfiddle;
  },
};
</script>
<style scoped lang="less">
</style>