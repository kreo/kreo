<template>
  <div :class="$options.name">
    <img
      class="image image--cover"
      src="https://media.giphy.com/media/TqiwHbFBaZ4ti/source.gif"
      alt="error"
    />
  </div>
</template>

<script>
  export default {
    name: 'FakeError'
  }
</script>

<style scoped>
.FakeError {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #131018;
}

.image--cover {
  display: block;
  width: 100%;
  max-width: 50vw;
  margin: 0 auto;
  object-fit: cover;
  object-position: center;
}
</style>