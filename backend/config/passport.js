import { Authenticator } from '@fastify/passport'
import LocalStrategy from 'passport-local';
import UserModel from '../models/UserModel.js';

const fastifyPassport = new Authenticator();

fastifyPassport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log("authenticating");
    const user = await UserModel.findOne({ where: {
        username: username,
        password: password
    }});

    if (!user) { 
        console.log("user not found"); 
        return done(null, null); 
    };

    return done(null, user); 
}));

fastifyPassport.registerUserSerializer(async (user, req) =>  {
    return user.dataValues.id;
});
fastifyPassport.registerUserDeserializer(async (id, req) => {
    console.log("TRYING TO DESERIALIZE");
    return await UserModel.findOne({ where: { id: id } });
});

export default fastifyPassport;