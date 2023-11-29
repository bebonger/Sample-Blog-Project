<template>
    <div class="post flex flex-col rounded-lg w-full overflow-hidden">
        <div class="post-header flex flex-col p-4">
            <h1 class="font-bold text-lg">Enter Post Title Here</h1>
            <p>by NAME</p>
        </div>
        <div v-if="!editing" class="post-content p-4">
            <p>{{ content }}</p>
        </div>

        <textarea v-else class="post-content m-4 border-white border-[1px] break-words p-2 h-64 w-auto" v-model="editContent"></textarea>

        <div class="post-footer flex flex-row gap-2 px-4 pb-4">
            <button v-if="!editing" @click="editPost" class="text-sm">Edit</button>
            <button v-if="!editing" @click="deletePost" class="text-sm">Delete</button>
            <button v-if="editing" @click="savePost" class="text-sm">Save</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PostComponent',
  props: {
    post_data: {}
  },
  data() {
    return {
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        editContent: "",
        editing: false
    }
  },
  methods: {
    editPost() {
        this.editing = true;
        this.editContent = this.content;
    },
    deletePost() {
        axios.post("/api/post/delete", {
            post_id: this.post_data.id
        });
    },
    savePost() {
        axios.post("/api/post/save", {
            post_id: this.post_data.id,
            content: this.editContent,
        });
    }
  }
}
</script>

<style>
.post {
    background-color: #344844;
}


.post-header {
    background-color: #486868;
}

.post-footer {
    background-color: transparent;
}

.post-content {
    background-color: transparent;
}

</style>