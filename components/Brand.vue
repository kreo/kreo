<template>
  <div :class="$options.name">
    <svg width='0' height='0'>
      <defs>
        <clipPath id="cp" clipPathUnits="objectBoundingBox">
          <path d="M0.500, 0.945 L0.994, 0.090 L0.006, 0.090 L0.500, 0.945 L0.500, 0.650 L0.262, 0.238 L0.738, 0.237 L0.500, 0.650z"></path>
        </clipPath>
      </defs>
    </svg>

    <div class="triangle first"></div>
    <div class="triangle second"></div>
  </div>
</template>

<script>
  export default {
    name: "Brand"
  }
</script>

<style scoped>
.triangle {
  // The actual clipping effect
  clip-path: url(#cp);

  // Keep it proportional
  width: 25vw;
  height: 25vw;
  max-height: 75vh;
  max-width: 75vh;

  // Add the styling
  background-size: cover;
  background-blend-mode: screen;

  // Center them
  position: absolute;
  top: 50%;
  left: 50%;
}

.first {
  background-color: #151515;
  /*background-image: url("https://www.fromanniek.com/wp-content/uploads/2018/06/0587f251249217.58e7079c0894c.gif");*/

 transform: translateX(-65%) translateY(-50%);
}

.second {
  background-color: #6de7cc;
  /*background-image: url("https://www.fromanniek.com/wp-content/uploads/2018/06/0587f251249217.58e7079c0894c.gif");*/

  transform: translateX(-35%) translateY(-50%);

  opacity: 1;
}
</style>