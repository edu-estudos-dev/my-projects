import { Sequelize } from 'sequelize';
import TasksModel from '../src/models/TasksModel.js';

const connection = new Sequelize('todolist', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

// Funções essenciais:
const setupDatabase = async () => {
    try {
        // 1. Testar conexão
        await connection.authenticate();
        console.log('✅ Conexão OK!');

        // 2. Inicializar modelos
        TasksModel.initModel(connection);

        // 3. Sincronizar
        await connection.sync({ alter: true }); // Cuidado com `alter` em produção!
        console.log('🔄 Banco sincronizado!');

    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
};

export { connection, setupDatabase };