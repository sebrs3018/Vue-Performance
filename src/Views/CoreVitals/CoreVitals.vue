<script setup lang="ts">
//@ts-ignore
import preloadedBg from "../../img/huge_background_img.jpeg?as=webp&w=500";
//Retrieving the url of the preloaded bg
//Caveat: if thje urls are different, then the preload won't have effect (= we are downloading from different sources...)
const img = preloadedBg;
</script>
<template>
  <div>
    <h1 class="">Core Vitals</h1>
    <h4>Apply prefetch to the following image</h4>

    <!-- Art direction: We are showing differences sizes of an image depending on a condition .
    IMP: it is different from resolution switching since we are not caring about it, we just want to 
    correctly size the images -->
    <picture>
      <source
        media="(max-width: 576px)"
        srcset="../../img/huge_deer.jpeg?as=webp&w=350"
        type="image/webp"
      />
      <source
        media="(min-width: 577px) and (max-width: 800px)"
        srcset="../../img/huge_deer.jpeg?as=webp&w=550"
        type="image/webp"
      />
      <img srcset="../../img/huge_deer.jpeg?as=webp&w=550" alt="huge deer" />
    </picture>

    <!-- This snippet (resolution switching) works but, with the preloading option it won't!  -->
    <!-- <img
      srcset="
        ../../img/huge_deer.jpeg?as=webp&w=100  1x,
        ../../img/huge_deer.jpeg?as=webp&w=1000 2x,
        ../../img/huge_deer.jpeg?as=webp&w=5000 3x
      "
      src="../../img/huge_deer.jpeg"
      alt="deer"
    /> -->

    <div
      id="container-with-bg"
      :style="{ backgroundImage: `url(${preloadedBg})` }"
    ></div>
  </div>
</template>

<style scoped>
#container-with-bg {
  width: 500px;
  height: 281px;
  background-size: cover;
}
</style>
