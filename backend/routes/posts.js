import PostModel from '../models/PostModel.js';
import STATUS_TYPES from '../../global/DataTypes.mjs';
import UserModel from '../models/UserModel.js';
import PostCommentModel from '../models/PostCommentModel.js';

async function posts (fastify, options) {
    fastify.get("/", async(req, res) => {
        const posts = await PostModel.findAll({ 
            include: [{ model: UserModel, attributes: ['username'] }], 
            order: [['createdAt', 'DESC']] 
        });
        await res.send(posts);
    });

    fastify.get("/:id", async(req, res) => {
        const comments = await PostCommentModel.findAll({ 
            where: { PostId: req.params.id },
            include: [{ model: UserModel, attributes: ['username'] }], 
            order: [['createdAt', 'DESC']] 
        });
        await res.send(comments);
    });

    fastify.post("/:id/comment", async(req, res) => {
        if (!req.session.isAuthenticated) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
            return;
        }

        if (!req.body.operation) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No operation specified"});
            return;
        }

        if (req.body.operation == 'create') {
            try {
                const comment = await PostCommentModel.create({
                    PostId: req.params.id,
                    UserId: req.session.user.id,
                    content: req.body.content
                });
            } catch (err) {
                res.send({ status: STATUS_TYPES.FAILURE, message: err});
            }
    
            await res.send({ status: STATUS_TYPES.SUCCESS, message: "Comment created successfully"});
        }

        if (req.body.operation == 'edit') {
            try {
                const comment = await PostCommentModel.findOne({ where: { id: req.params.id }});

                if (!req.session.isAuthenticated || !comment || req.session.user.id != comment.UserId) {
                    res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
                    return;
                }

                comment.content = req.body.content;
                await comment.save();
                await res.send({ status: STATUS_TYPES.SUCCESS, message: "Comment updated successfully"});

            } catch (err) {
                res.send({ status: STATUS_TYPES.FAILURE, message: err.message});
            }
        }

        if (req.body.operation == 'delete') {
            try {
                const comment = await PostCommentModel.findOne({ where: { id: req.params.id }});

                if (!req.session.isAuthenticated || !comment || req.session.user.id != comment.UserId) {
                    res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
                    return;
                }
                await comment.destroy();
                await res.send({ status: STATUS_TYPES.SUCCESS, message: "Comment deleted successfully"});

            } catch (err) {
                res.send({ status: STATUS_TYPES.FAILURE, message: err.message});
            }
        }

    });

    fastify.post("/create", async(req, res) => {
        if (!req.session.isAuthenticated) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
            return;
        }

        const post = PostModel.build({
            title: req.body.title,
            content: req.body.content,
            UserId: req.session.user.id
        });

        await post.save();
        await res.send({ status: STATUS_TYPES.SUCCESS, message: "Post created successfully" });
    });

    fastify.post("/edit", async(req, res) => {
        const post = await PostModel.findOne({ where: { id: req.body.post_id }});
        
        if (!req.session.isAuthenticated || !post || req.session.user.id != post.UserId) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
            return;
        }

        post.content = req.body.content;
        await post.save();

        await res.send({ status: STATUS_TYPES.SUCCESS, message: "Post updated successfully" });

    });

    fastify.post("/delete", async(req, res) => {
        const post = await PostModel.findOne({ where: { id: req.body.post_id }});
        
        if (!req.session.isAuthenticated || !post || req.session.user.id != post.UserId) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
            return;
        }

        await post.destroy();
        
        await res.send({ status: STATUS_TYPES.SUCCESS, message: "Post deleted" });
    });

    fastify.get("/me", async(req, res) => {
        if (!req.session.isAuthenticated) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
            return;
        }

        const posts = await PostModel.findAll({ 
            where: { UserId: req.session.user.id },
            include: [{ model: UserModel, attributes: ['username'] }], 
            order: [['createdAt', 'DESC']] 
        });
        await res.send(posts);
    });

    fastify.post("/comments", async(req, res) => {
        const post = await PostModel.findOne({ where: { id: req.body.post_id }});
        
        if (!req.session.isAuthenticated || !post || req.session.user.id != post.UserId) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
            return;
        }

        await post.destroy();
        
        await res.send({ status: STATUS_TYPES.SUCCESS, message: "Post deleted" });
    });
}

export default posts;