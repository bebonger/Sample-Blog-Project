import { DataTypes } from 'sequelize';
import sequelizeInstance from '../config/database.js';

const PostCommentModel = sequelizeInstance.define('PostComment', {
    // PRIMARY KEY
    id: { 
        type: DataTypes.UUID, 
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    content: {
        type: DataTypes.TEXT
    },
});

export default PostCommentModel;