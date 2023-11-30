<template>
    <div class="p-4 flex flex-col">
        <p class="font-bold">{{ comment_data.user.username }}</p>    
        <p v-if="!editing" class="">{{ comment_data.content }}</p>
        <textarea v-else class="bg-transparent border-white border-[1px] break-words p-2 h-32 w-auto" v-model="editContent"></textarea>
        <p class="text-sm text-white/50">published on <b>{{ formatDateTime(comment_data.createdAt) }}</b></p>
        <p v-if="comment_data.createdAt != comment_data.updatedAt" class="text-sm text-white/50">edited on <b>{{ formatDateTime(comment_data.updatedAt) }}</b></p>
        <div class="post-footer flex flex-row gap-2">
            <button v-if="!editing && isAuthor() && !replying" @click="editComment" class="text-sm text-white/50">Edit</button>
            <button v-if="!editing && isAuthor() && !replying" @click="deleteComment" class="text-sm text-white/50">Delete</button>
            <button v-if="editing && isAuthor() && !replying" @click="saveComment" class="text-sm text-white/50">Save</button>
            <button v-if="editing && isAuthor() && !replying" @click="cancelEdit" class="text-sm text-white/50">Cancel</button>
            <button v-if="!editing && !replying && this.$store.getters.isLoggedIn" @click="replyComment" class="text-sm text-white/50">Reply</button>
            <button v-if="!editing && replying && this.$store.getters.isLoggedIn" @click="replying = false" class="text-sm text-white/50">Cancel</button>
        </div>
        <div v-if="this.$store.getters.isLoggedIn && replying" class="w-full p-4">
            <textarea class="bg-transparent rounded-lg border-white/50 border-[1px] break-words p-2 h-24 w-full hover:border-white transition-all" placeholder="Write a comment..." v-model="commentContent"></textarea>
            <button type="button" @click="createSubComment" class="ml-auto border-[1px] p-2 rounded-lg hover:bg-white hover:text-black transition-all mt-2">Reply to comment</button>
        </div>

        <div v-if="comment_data.subComments.length > 0">
            <button class="text-sm text-white/50" @click="showReplies = !showReplies">{{ showReplies ? 'Hide replies' : 'Show replies' }}</button>
        </div>
        
        <div v-if="comment_data.subComments.length > 0 && showReplies" class="ml-4 border-l-[1px] border-dashed">
            <PostCommentComponent :comment_data="comment" class="p-4 flex flex-col" v-for="comment in comment_data.subComments" :key="comment.id" @commentUpdate="emitCommentUpdateEvent"/>
        </div>
    </div>
</template>

<script>
import STATUS_TYPES from '../../../global/DataTypes.mjs';
import axios from 'axios';

export default {
    props: {
        comment_data: {}
    },
    data() {
        return { 
            showReplies: false,
            editContent: "",
            editing: false,
            replying: false
        }
    },
    methods: {
        isAuthor() {
            return (this.$store.state.user && this.comment_data.UserId == this.$store.state.user.id);  
        },
        editComment() {
            this.editing = true;
            this.editContent = this.comment_data.content;
        },
        replyComment() {
            this.replying = true;
        },
        async deleteComment() {
            if (!confirm("Are you sure you want to delete this comment?"))
                return;
            const res = await axios.post(`/api/posts/${this.comment_data.PostId}/comment`, {
                operation: 'delete',
                id: this.comment_data.id
            });
            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }
            alert("Comment deleted");
            this.$emit("commentUpdate");
        },
        async saveComment() {
            const res = await axios.post(`/api/posts/${this.comment_data.PostId}/comment`, {
                content: this.editContent,
                operation: 'edit',
                id: this.comment_data.id
            });
            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }
            alert("Comment updated successfully");
            this.editing = false;
            this.$emit("commentUpdate");
        },
        async createSubComment() {
            const res = await axios.post(`/api/posts/comment/${this.comment_data.id}`, {
                operation: "create",
                content: this.commentContent,
            });
            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }

            this.commentContent = "";
            this.replying = false;
            alert("Comment created successfully");
            this.$emit("commentUpdate");
        },
        cancelEdit() {
            this.editing = false;
        },
        emitCommentUpdateEvent() {
            this.$emit("commentUpdate");
        },
        formatDateTime(dateTimeString) {
            const options = { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
            const date = new Date(dateTimeString);
            return date.toLocaleDateString(undefined, options);
        }
    }
}
</script>