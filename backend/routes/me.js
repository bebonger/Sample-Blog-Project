import UserModel from '../models/UserModel.js';
import fastifyPassport from '../config/passport.js';
import STATUS_TYPES from '../helpers/DataTypes.js';

async function me (fastify, options) {
    fastify.get("/", async(req, res) => {
        if (req.session.isAuthenticated) {
            res.send({ status: STATUS_TYPES.SUCCESS, user: req.session.user });
        } else {
            res.send({ status: STATUS_TYPES.FAILURE, message: 'not authenticated' });
        }
    });
}

export default me;