import UserModel from '../models/UserModel.js';
import STATUS_TYPES from '../../global/DataTypes.mjs';
import { Op } from 'sequelize';

async function auth (fastify, options) {
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    });

    fastify.post('/register', async (req, res) => {

        let user = await UserModel.findOne({ 
            where: { 
                [Op.or] : [
                    { username: req.body.username },
                    { email: req.body.email },
                ] 
            }
        })

        if (user) {
            console.log(`user ${req.body.username} already exists`);
            await res.send({ status: STATUS_TYPES.FAILURE, message: `Username or email already in use.` });
            return;
        }

        user = UserModel.build({ 
                username: req.body.username, 
                email: req.body.email,
                password: req.body.password,
            });
        await user.save();

        console.log(`new user ${req.body.username} was created!`);
        req.session.user = {
            id: user.dataValues.id,
            username: user.dataValues.username,
            email: user.dataValues.email,
        };

        req.session.isAuthenticated = true;

        await res.send({ status: STATUS_TYPES.SUCCESS, message: `User created successfully.` });
    })

    fastify.post('/login', async function(req, res) {

        const user = await UserModel.findOne({ where: {
            username: req.body.username,
            password: req.body.password
        }});

        if (!user) {
            await res.send({ status: STATUS_TYPES.FAILURE, message: `Wrong username or password` });
        } else {
            req.session.user = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                email: user.dataValues.email,
            };

            req.session.isAuthenticated = true;

            await res.send({ status: STATUS_TYPES.SUCCESS, message: `Login successful` });
        }
    });

    fastify.get('/logout', async (req, res) => {
        await req.session.destroy();
        await res.send({ message: 'Logged out' });
    }); 

    fastify.get('/test', async (req, res) => {
        await res.send(req.session);
    }); 
}

export default auth;