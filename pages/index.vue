<template>
  <div class="container">
    <Fuck />
  </div>
</template>

<script>
import Fuck from '@/components/Fuck.vue'

export default {
  components: {
    Fuck
  }
}
</script>

<style>
html {
  box-sizing: border-box;
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

* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
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
