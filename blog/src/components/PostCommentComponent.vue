<template>
    <div class="p-4 flex flex-col">
        <p class="font-bold">{{ comment_data.User.username }}</p>    
        <p v-if="!editing" class="">{{ comment_data.content }}</p>
        <textarea v-else class="bg-transparent border-white border-[1px] break-words p-2 h-32 w-auto" v-model="editContent"></textarea>
        <p class="text-sm text-white/50">published on <b>{{ formatDateTime(comment_data.createdAt) }}</b></p>
        <p v-if="comment_data.createdAt != comment_data.updatedAt" class="text-sm text-white/50">edited on <b>{{ formatDateTime(comment_data.updatedAt) }}</b></p>
        <div v-if="isAuthor()" class="post-footer flex flex-row gap-2">
            <button v-if="!editing" @click="editComment" class="text-sm text-white/50">Edit</button>
            <button v-if="!editing" @click="deleteComment" class="text-sm text-white/50">Delete</button>
            <button v-if="editing" @click="saveComment" class="text-sm text-white/50">Save</button>
            <button v-if="editing" @click="cancelEdit" class="text-sm text-white/50">Cancel</button>
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

            editContent: "",
            editing: false
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
        async deleteComment() {
            if (!confirm("Are you sure you want to delete this comment?"))
                return;
            const res = await axios.post(`/api/posts/${this.comment_data.id}/comment`, {
                post_id: this.comment_data.id,
                operation: 'delete'
            });
            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }
            alert("Comment deleted");
            this.$emit("commentUpdate");
        },
        async saveComment() {
            const res = await axios.post(`/api/posts/${this.comment_data.id}/comment`, {
                post_id: this.comment_data.id,
                content: this.editContent,
                operation: 'edit'
            });
            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }
            alert("Comment updated successfully");
            this.editing = false;
            this.$emit("commentUpdate");
        },
        cancelEdit() {
            this.editing = false;
        },
        formatDateTime(dateTimeString) {
            const options = { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
            const date = new Date(dateTimeString);
            return date.toLocaleDateString(undefined, options);
        }
    }
}
</script>