<template>
  <div class="max-w-5xl mx-auto flex flex-col items-center justify-center pt-6 px-6 gap-6">
    <h1 class="font-bold text-5xl">Recent Posts</h1>
    <button v-if="this.$store.getters.isLoggedIn" @click="togglePostCreate(true)" class="ml-auto border-[1px] p-2 rounded-lg hover:bg-white hover:text-black transition-all">Create Post</button>
    <div v-if="this.$store.getters.isLoggedIn && creatingPost" class="fixed top-0 left-0 w-screen h-screen bg-black/70 transition-all">
      <div class="max-w-5xl mx-auto flex flex-col items-center justify-center pt-12 px-6 gap-6">
        <div class="post-create w-full flex flex-col rounded-xl p-6 gap-2">
          <div class="flex flex-row items-start pb-2">
            <h1 class="font-bold text-5xl">New Post</h1>
            <button class="ml-auto" @click="togglePostCreate(false)">Cancel</button>
          </div>
          <p class="text-white/50">Title</p>
          <input v-model="newPost.title" class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all"/>
          <br>
          <p class="text-white/50">Content</p>
          <textarea v-model="newPost.content" class="bg-transparent rounded-lg border-white/50 border-[1px] break-words p-2 h-96 w-auto hover:border-white transition-all"></textarea>
          <button @click="createPost" class="ml-auto border-[1px] p-2 rounded-lg hover:bg-white hover:text-black transition-all mt-2">Create Post</button>
        </div>
      </div>
    </div>

    <p v-if="posts.length == 0">No posts found</p>
    <PostComponent v-for="post in posts" :key="post.id" :post_data="post" @postUpdate="refreshPosts"/>
  </div>
</template>

<script>
// @ is an alias to /src
import PostComponent from '@/components/PostComponent.vue'
import axios from 'axios';
import STATUS_TYPES from '@/../../global/DataTypes.mjs'

export default {
  name: 'HomeView',
  components: {
    PostComponent
  },
  async mounted() {
    await this.refreshPosts();
  },
  methods: {
    togglePostCreate(toggle) {
      this.creatingPost = toggle;
    },
    async createPost() {
      if (this.newPost.title.trim().length == 0 || this.newPost.content.trim().length == 0) {
        alert("Title or content cannot be empty!");
        return;
      }

      try {
        const res = await axios.post("/api/posts/create", {
          title: this.newPost.title,
          content: this.newPost.content
        });

        if (res.data.status == STATUS_TYPES.SUCCESS) {
          alert("Post created successfully");
          this.creatingPost = false;
          this.newPost.title = "";
          this.newPost.content = "";

          await this.refreshPosts();
        } else {
          alert("Something went wrong: " + res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async refreshPosts() {
      const res = await axios.get("/api/posts");
      this.posts = res.data;
    }
  },
  data() {
    return {
      posts: [],
      creatingPost: false,
      newPost: {
        title: "",
        content: "",
      }
    }
  }
}
</script>

<style>
.post-create {
  background-color: #344844;
}
</style>
