<template>
  <div :class="name">
    <img
      :class="`${name}__image`"
      src="https://media.giphy.com/media/TqiwHbFBaZ4ti/source.gif"
      alt="error"
    />
  </div>
</template>

<script>
  export default {
    name: 'FakeError',
    computed: {
      name() {
        return this.$options.name
      }
    }
  }
</script>

<style lang="scss" scoped>
.FakeError {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #131018;

  &__image {
    display: block;
    width: 100%;
    max-width: 50vw;
    max-height: 50vh;
    margin: 0 auto;
    object-fit: cover;
    object-position: center;
  }
}
</style>