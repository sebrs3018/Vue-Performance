<script setup lang="ts">
//@ts-ignore
import preloadedBg from "../../img/huge_background_img.jpeg?as=webp&w=500";
//Retrieving the url of the preloaded bg
//Caveat: if thje urls are different, then the preload won't have effect (= we are downloading from different sources...)
const img = preloadedBg;
</script>
<template>
  <div class="flex flex-col items-center mx-10">
    <h1 class="text-xl mb-2">Core Vitals</h1>
    <h2 class="text-lg">Apply prefetch to the following image</h2>

    <!-- Resolution switching: in case we want to serve the most appropriate image according to the density pixel
                           of the device which requested an image, this is the technique we want!
Note: in order to make this work, we have to disable the preloading  -->
    <!-- <img
      srcset="
        ../../img/huge_deer.jpeg?as=webp&w=100  1x,
        ../../img/huge_deer.jpeg?as=webp&w=1000 2x,
        ../../img/huge_deer.jpeg?as=webp&w=5000 3x
      "
      src="../../img/huge_deer.jpeg"
      alt="deer"
    /> -->

    <!-- Art direction: We are showing different sizes of an image depending on a condition .
    IMP: 
      - it is different from resolution switching since we are not caring about it, we just want to 
        correctly size the images 
      - Limitation of prefetch plugin: since we do not know in advance which of these pictures will be loaded, the plugin will download all of them!
    -->
    <!-- <picture class="m-10">
      <source
        media="(max-width: 576px)"
        srcset="../../img/huge_deer.jpeg?as=webp&w=250"
        type="image/webp"
      />
      <source
        media="(min-width: 577px) and (max-width: 800px)"
        srcset="../../img/huge_deer.jpeg?as=webp&w=350"
        type="image/webp"
      />
      <img srcset="../../img/huge_deer.jpeg?as=webp&w=450" alt="huge deer" />
    </picture> -->

    <img
      class="my-10"
      srcset="../../img/huge_deer.jpeg?as=webp&w=450"
      alt="huge deer"
      width="200"
      height="auto"
      fetchpriority="high"
    />

    <p class="w-5/6 mb-10">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia ipsa
      minima quo corrupti accusamus animi suscipit nostrum molestiae, nihil cum
      nemo sapiente repellendus qui, ex in doloremque, repellat amet minus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia ipsa
      minima quo corrupti accusamus animi suscipit nostrum molestiae, nihil cum
      nemo sapiente repellendus qui, ex in doloremque, repellat amet minus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia ipsa
      minima quo corrupti accusamus animi suscipit nostrum molestiae, nihil cum
      nemo sapiente repellendus qui, ex in doloremque, repellat amet minus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia ipsa
      minima quo corrupti accusamus animi suscipit nostrum molestiae, nihil cum
      nemo sapiente repellendus qui, ex in doloremque, repellat amet minus.
      minima quo corrupti accusamus animi suscipit nostrum molestiae, nihil cum
      nemo sapiente repellendus qui, ex in doloremque, repellat amet minus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia ipsa
      minima quo corrupti accusamus animi suscipit nostrum molestiae, nihil cum
      nemo sapiente repellendus qui, ex in doloremque, repellat amet minus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia ipsa
      minima quo corrupti accusamus animi suscipit nostrum molestiae, nihil cum
      nemo sapiente repellendus qui, ex in doloremque, repellat amet minus.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia ipsa
      minima quo corrupti accusamus animi suscipit nostrum molestiae, nihil cum
      nemo sapiente repellendus qui, ex in doloremque, repellat amet minus.
    </p>

    <div
      id="container-with-bg"
      :style="{ backgroundImage: `url(${preloadedBg})` }"
    ></div>
  </div>
</template>

<style scoped>
@import "../../assets/tailwind.css";

#container-with-bg {
  width: 500px;
  height: 281px;
  background-size: cover;
}
</style>
