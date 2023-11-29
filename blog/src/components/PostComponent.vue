<template>
    <div class="post flex flex-col rounded-lg w-full overflow-hidden">
        <div class="post-header flex flex-col p-4">
            <h1 class="font-bold text-lg">{{ post_data.title }}</h1>
            <p>by {{ post_data.User.username }}</p>
        </div>
        <div v-if="!editing" class="post-content p-4">
            <p>{{ post_data.content }}</p>
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
        editContent: "",
        editing: false
    }
  },
  methods: {
    editPost() {
        this.editing = true;
        this.editContent = this.post_data.content;
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