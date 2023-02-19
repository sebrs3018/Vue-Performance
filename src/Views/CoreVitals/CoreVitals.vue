<script setup lang="ts">
//@ts-ignore
import preloadedBg from "../../img/huge_background_img.jpg";
//Retrieving the url of the preloaded bg
const img = preloadedBg;
</script>
<template>
  <div>
    <h1 class="">Core Vitals</h1>
    <h4>Apply prefetch to the following image</h4>
    <img src="../../img/huge_deer.jpeg" width="500" height="auto" />
    <div
      id="container-with-bg"
      :style="{ backgroundImage: `url(${preloadedBg})` }"
    ></div>
  </div>
</template>

<style scoped>
#container-with-bg {
  width: 500px;
  height: 250px;
  background-size: cover;
}
</style>
