<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 11:58:07
 * @LastEditTime: 2019-09-20 10:13:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    测试
    <testBox></testBox>
  </div>
</template>
<script>
import testBox from "./index.md";
export default {
  components: {
    testBox
  },
  data() {},
  mounted() {
    console.log(testBox);
  }
};
</script>