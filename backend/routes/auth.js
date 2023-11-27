import sequelizeInstance from '../database.js';
import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';

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
        schema: {
            body: {
                username: { type: 'string' },
                password: { type: 'string' },
            }
        },
    }, async (request, reply) => {
        let user = await UserModel.findOne({ where: { username: request.body.username, password: request.body.password } })
        if (user) {
            reply.send(`Logged into ${user.displayName}`);
            
            reply.send(`Logged into ${user.displayName}`);
        } else {
            reply.send(`Incorrect Username or Password`);
        }
    })
}

export default auth;