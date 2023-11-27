<template>
  <div class="max-w-5xl mx-auto flex flex-col items-center justify-center pt-6 gap-6">
    <h1 class="font-bold text-5xl">Recent Posts</h1>
    <HelloWorld/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
