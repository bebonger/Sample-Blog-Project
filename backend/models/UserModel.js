import { DataTypes } from 'sequelize';
import sequelizeInstance from '../config/database.js';
import PostModel from './PostModel.js';

const UserModel = sequelizeInstance.define('User', {
    // PRIMARY KEY
    id: { 
        type: DataTypes.UUID, 
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 16
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 64,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});


export default UserModel;