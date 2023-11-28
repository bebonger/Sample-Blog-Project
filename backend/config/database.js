import Sequelize from 'sequelize';

const sequelizeInstance = new Sequelize('blog', 'root', '3252', {
    dialect: 'mysql',
    host: '127.0.0.1'
});

try {
    await sequelizeInstance.authenticate();
    console.log('Database connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelizeInstance;