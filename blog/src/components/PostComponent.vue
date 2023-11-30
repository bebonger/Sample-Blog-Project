<template>
    <div class="post flex flex-col rounded-lg w-full overflow-hidden pb-4">
        <div class="post-header flex flex-col p-4">
            <h1 class="font-bold text-lg">{{ post_data.title }}</h1>
            <p>by {{ post_data.User.username }}</p>
        </div>
        <div v-if="!editing" class="post-content p-4">
            <p>{{ post_data.content }}</p>
        </div>

        <textarea v-else class="post-content m-4 border-white border-[1px] break-words p-2 h-64 w-auto" v-model="editContent"></textarea>

        <p class="mx-4 text-sm text-white/50">published on <b>{{ formatDateTime(post_data.createdAt) }}</b></p>
        <p v-if="post_data.createdAt != post_data.updatedAt" class="mx-4 text-sm text-white/50">edited on <b>{{ formatDateTime(post_data.updatedAt) }}</b></p>
        <div v-if="isAuthor()" class="post-footer flex flex-row gap-2 px-4">
            <button v-if="!editing" @click="editPost" class="text-sm">Edit</button>
            <button v-if="!editing" @click="deletePost" class="text-sm">Delete</button>
            <button v-if="editing" @click="savePost" class="text-sm">Save</button>
            <button v-if="editing" @click="cancelEdit" class="text-sm">Cancel</button>
        </div>

        <div v-if="comments.length > 0 || this.$store.getters.isLoggedIn" class="w-full mt-4">
            <hr class="pb-4 mx-4">
            <h1 class="px-4">Comments</h1>

            <div v-if="this.$store.getters.isLoggedIn" class="w-full p-4">
                <textarea class="bg-transparent rounded-lg border-white/50 border-[1px] break-words p-2 h-24 w-full hover:border-white transition-all" placeholder="Write a comment..." v-model="commentContent"></textarea>
                <button type="button" @click="createComment" class="ml-auto border-[1px] p-2 rounded-lg hover:bg-white hover:text-black transition-all mt-2">Create Comment</button>
            </div>

            <div class="flex flex-col">
                <PostCommentComponent :comment_data="comment" class="p-4 flex flex-col" v-for="comment in comments" :key="comment.id" @commentUpdate="refreshComments"/>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import STATUS_TYPES from '../../../global/DataTypes.mjs';
import PostCommentComponent from './PostCommentComponent.vue';

export default {
    name: "PostComponent",
    props: {
        post_data: {}
    },
    async mounted() {
        await this.refreshComments();
    },
    data() {
        return {
            comments: [],
            editContent: "",
            commentContent: "",
            editing: false
        };
    },
    methods: {
        editPost() {
            this.editing = true;
            this.editContent = this.post_data.content;
        },
        isAuthor() {
            return (this.$store.state.user && this.post_data.UserId == this.$store.state.user.id);
        },
        isCommentAuthor(commentId) {
            return commentId == this.$store.state.user.id;
        },
        async deletePost() {
            if (!confirm("Are you sure you want to delete this post?"))
                return;
            const res = await axios.post("/api/posts/delete", {
                post_id: this.post_data.id
            });
            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }
            alert("Post deleted");
            this.$emit("postUpdate");
        },
        async savePost() {
            const res = await axios.post("/api/posts/edit", {
                post_id: this.post_data.id,
                content: this.editContent,
            });
            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }
            alert("Post updated successfully");
            this.editing = false;
            this.$emit("postUpdate");
        },
        async createComment() {
            const res = await axios.post(`/api/posts/${this.post_data.id}/comment`, {
                operation: "create",
                content: this.commentContent,
            });
            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }

            this.commentContent = "";
            alert("Comment created successfully");
            await this.refreshComments();
        },
        async refreshComments() {
            const res = await axios.get(`/api/posts/${this.post_data.id}`);
            console.log(res.data);
            this.comments = res.data;
        },
        cancelEdit() {
            this.editing = false;
        },
        formatDateTime(dateTimeString) {
            const options = { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
            const date = new Date(dateTimeString);
            return date.toLocaleDateString(undefined, options);
        }
    },
    components: { PostCommentComponent }
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