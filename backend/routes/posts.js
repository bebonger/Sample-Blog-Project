import PostModel from '../models/PostModel.js';
import STATUS_TYPES from '../../global/DataTypes.mjs';
import UserModel from '../models/UserModel.js';
import PostCommentModel from '../models/PostCommentModel.js';
import { Op } from 'sequelize';

async function posts (fastify, options) {
    fastify.get("/", async(req, res) => {
        const posts = await PostModel.findAll({ 
            include: [{ model: UserModel, attributes: ['username'] }], 
            order: [['createdAt', 'DESC']] 
        });
        await res.send(posts);
    });

    fastify.get("/:id", async(req, res) => {
        let comments = await PostCommentModel.findAll({ 
            where: { PostId: req.params.id },
            include: [{ model: UserModel, attributes: ['username'] }], 
            order: [['createdAt', 'DESC']],
            raw: true
        });

        const processedComments = comments.map(comment => {
            comment.user = { username: comment['User.username'] };
            delete comment['User.username'];
            return comment;
        });
        
        const promises = [];
        processedComments.forEach(comment => {
            promises.push(recursivelyGetComments(comment));
        })

        const fullComments = await Promise.all(promises);

        console.log(fullComments);
        await res.send(fullComments);
    });

    const recursivelyGetComments = async(comment, isRaw = true) => {
        const subComments = await PostCommentModel.findAll({
            where: { PostCommentId: comment.id },
            include: [{ model: UserModel, attributes: ['username'] }], 
            order: [['createdAt', 'DESC']],
            raw: isRaw
        });

        const processedComments = subComments.map(comment => {
            comment.user = { username: comment['User.username'] };
            delete comment['User.username'];
            return comment;
        });

        if (processedComments.length > 0) {
            const promises = [];
            processedComments.forEach(comment => {
                promises.push(recursivelyGetComments(comment));
            });

            comment['subComments'] = await Promise.all(promises);
        }

        else comment['subComments'] = [];
        return comment;
    }

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
                const comment = await PostCommentModel.findOne({ where: { id: req.body.id }});

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
                const comment = await PostCommentModel.findOne({ where: { id: req.body.id }});

                if (!req.session.isAuthenticated || !comment || req.session.user.id != comment.UserId) {
                    res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
                    return;
                }

                // const fullComment = await recursivelyGetComments(comment, false);
                // await recursivelyDeleteComments(fullComment);
                await comment.destroy();
                
                await res.send({ status: STATUS_TYPES.SUCCESS, message: "Comment deleted successfully"});

            } catch (err) {
                res.send({ status: STATUS_TYPES.FAILURE, message: err.message}); 
            }
        }
    });

    // THIS IS NOT WORKING SO IM NOT GOING TO CARE
    const recursivelyDeleteComments = async (comment) => {
        
        if (!comment) return;

        if (comment.subComments.length > 0) {
            const promises = [];
            comment['subComments'].forEach(subComment => {
                promises.push(recursivelyDeleteComments(subComment));
            });

            await Promise.all(promises);
            await comment.destroy();
        } else {
            await comment.destroy();
        }

        console.log(`Destroying comment: ${JSON.stringify(comment)}`);
        
    }

    fastify.post("/comment/:commentId", async(req, res) => {
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
                    PostCommentId: req.params.commentId,
                    UserId: req.session.user.id,
                    content: req.body.content
                });
            } catch (err) {
                res.send({ status: STATUS_TYPES.FAILURE, message: err});
            }
    
            await res.send({ status: STATUS_TYPES.SUCCESS, message: "Comment created successfully"});
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

        /*
        let comments = await PostCommentModel.findAll({ 
            where: { PostId: req.body.post_id },
            order: [['createdAt', 'DESC']],
        });

        if (comments.length > 0) {
            let promises = [];
            comments.forEach(comment => {
                promises.push(recursivelyGetComments(comment));
            });

            const fullComments = await Promise.all(promises);

            promises = [];
            console.log(fullComments);
            fullComments.forEach(comment => {
                promises.push(recursivelyDeleteComments(comment));
            });

            await Promise.all(promises);
        }
        */

        await post.destroy();
        
        await res.send({ status: STATUS_TYPES.SUCCESS, message: "Post deleted" });
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