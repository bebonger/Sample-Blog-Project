<template>
  <div class="max-w-5xl mx-auto flex flex-col items-center justify-center pt-6 px-6 gap-6">
    <h1 class="font-bold text-5xl">Recent Posts</h1>
    <PostComponent/>
    <PostComponent/>
    <PostComponent/>
    <PostComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import PostComponent from '@/components/PostComponent.vue'

export default {
  name: 'HomeView',
  components: {
    PostComponent
  }
}
</script>
