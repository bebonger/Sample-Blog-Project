import UserModel from '../models/UserModel.js';
import STATUS_TYPES from '../../global/DataTypes.mjs';

async function me (fastify, options) {
    fastify.get("/", async(req, res) => {
        if (req.session.isAuthenticated) {
            await res.send({ status: STATUS_TYPES.SUCCESS, user: req.session.user });
        } else {
            await res.send({ status: STATUS_TYPES.FAILURE, message: 'not authenticated' });
        }
    });

    fastify.post("/change-pass", async(req, res) => {
        if (!req.session.isAuthenticated) {
            await res.send({ status: STATUS_TYPES.FAILURE, message: 'not authenticated' });
        }

        const user = await UserModel.findOne({ where: { id: req.session.user.id }});

        if (!user) {
            await res.send({ status: STATUS_TYPES.FAILURE, message: 'user not found' });
            return;
        }

        if (user.password != req.body.currPassword) {
            await res.send({ status: STATUS_TYPES.FAILURE, message: 'Current password does not match' });
            return;
        }

        if (user.password == req.body.newPassword) {
            await res.send({ status: STATUS_TYPES.FAILURE, message: 'New password should not be the same as the current password' });
            return;
        }

        user.password = req.body.newPassword;
        await res.send({ status: STATUS_TYPES.SUCESS, message: 'Password changed successfully' });
        await user.save();

    });
}

export default me;