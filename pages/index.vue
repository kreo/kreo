<template>
  <div class="container">
    <Brand />
  </div>
</template>

<script>
import Brand from '@/components/Brand.vue'

export default {
  components: {
    Brand
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html {
  min-height: 100%;
  height: 100%;
}
body {
  height: 100%;
  overflow: hidden;
  background: #08080c;
  background: radial-gradient(#08080c, #000);
  background-size: cover;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
