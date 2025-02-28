import dotenv from 'dotenv';
import app from './app.js';
import { setupDatabase } from './database/connection.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

const startServer = async () => {
	try {
		await setupDatabase();

		const server = app.listen(PORT, () => {
			console.log(`✅ Server running at: http://localhost:${PORT}`);
		});

		// Adicione este bloco para tratamento de erros de porta
		server.on('error', error => {
			if (error.code === 'EADDRINUSE') {
				console.log(`\n⚠️  A porta ${PORT} está sendo usada! Soluções rápidas:
            1. Feche todas as instâncias do terminal/VSCode
            2. Execute no PowerShell: kill-port 8080
            3. Reinicie o XAMPP/Apache`);
			} else {
				console.error('❌ Erro no servidor:', error);
			}
		});

		// Graceful shutdown melhorado
		const shutdown = async signal => {
			console.log(`\n🛑 Recebido sinal ${signal}. Encerrando servidor...`);
			server.close(() => {
				console.log('⚡ Servidor encerrado com sucesso!');
				process.exit(0);
			});

			// Force close após 5 segundos
			setTimeout(() => {
				console.log('⏰ Encerramento forçado do servidor');
				process.exit(1);
			}, 5000);
		};

		// Captura mais sinais de encerramento
		process.on('SIGINT', () => shutdown('SIGINT'));
		process.on('SIGTERM', () => shutdown('SIGTERM'));
		process.on('exit', () => shutdown('exit'));
	} catch (error) {
		console.error('❌ Falha crítica na inicialização:', error);
		process.exit(1);
	}
};

startServer();
