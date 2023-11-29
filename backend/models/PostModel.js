import { DataTypes } from 'sequelize';
import sequelizeInstance from '../config/database.js';

const PostModel = sequelizeInstance.define('Post', {
    // PRIMARY KEY
    id: { 
        type: DataTypes.UUID, 
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 256
    },
    content: {
        type: DataTypes.TEXT
    },
});

export default PostModel;