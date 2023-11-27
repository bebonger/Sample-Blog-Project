import sequelizeInstance from '../database.js';
import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import fastifyPassport from '../passport.js';

async function auth (fastify, options) {
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    });

    fastify.post('/signup', {
        schema: {
            body: {
                username: { type: 'string' },
                displayName: { type: 'string'},
                password: { type: 'string' },
            }
        },
    }, async (request, reply) => {
        let user = await UserModel.findOne({ where: { username: request.body.username } })
        if (!user) {
            user = UserModel.build({ 
                    username: request.body.username, 
                    displayName: request.body.displayName,
                    password: request.body.password,
                });
            await user.save();
            console.log(`new user ${request.body.username} was created!`);
        } else {
            console.log(`user ${request.body.username} already exists`);
        }
        reply.send(request.body);
    })

    fastify.post('/login', {
        preValidation: fastifyPassport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    }, () => { console.log("bruh") });
}

export default auth;