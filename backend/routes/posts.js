import PostModel from '../models/PostModel.js';
import STATUS_TYPES from '../helpers/DataTypes.js';
import UserModel from '../models/UserModel.js';

async function posts (fastify, options) {
    fastify.get("/", async(req, res) => {
        const posts = await PostModel.findAll({ include: [{ model: UserModel, attributes: ['username'] }] });
        await res.send(posts);
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
        if (!req.session.isAuthenticated) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
            return;
        }
    });

    fastify.post("/delete", async(req, res) => {
        if (!req.session.isAuthenticated) {
            res.send({ status: STATUS_TYPES.FAILURE, message: "No permissions to perform this action"});
            return;
        }
    });

    fastify.get("/me", async(req, res) => {
        
    });
}

export default posts;