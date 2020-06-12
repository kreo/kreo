<template>
  <div :class="name">
    <img
      :class="`${name}__media`"
      src="~/assets/images/fuck.gif"
      alt="error"
    />
  </div>
</template>

<script>
  export default {
    name: 'Fuck',
    computed: {
      name() {
        return this.$options.name
      }
    }
  }
</script>

<style scoped>
.Fuck {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #131018;
}

.Fuck__media {
  max-width: 50vw;
  max-height: 50vh;
  object-fit: cover;
  object-position: center;
}
</style>