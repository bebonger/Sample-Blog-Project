import { DataTypes } from 'sequelize';
import sequelizeInstance from '../config/database.js';

const UserModel = sequelizeInstance.define('User', {
    // PRIMARY KEY
    id: { 
        type: DataTypes.UUID, 
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        length: 16
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

(async () => {
    await sequelizeInstance.sync({ force: true });
    // Code here
})();

export default UserModel;