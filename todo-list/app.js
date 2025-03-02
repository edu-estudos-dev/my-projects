import flash from 'connect-flash';
import express from 'express';
import session from 'express-session';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurações de caminho
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria instância do Express
const app = express();

// 1. Configuração da Sessão (deve vir primeiro)
app.use(
	session({
		secret: 'sua_chave_secreta_super_segura',
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false, // Altere para true se usar HTTPS
			maxAge: 3600000 // 1 hora
		}
	})
);

// 2. Configuração do Flash (depende da sessão)
app.use(flash());

// 3. Middleware para disponibilizar mensagens para todas as views
app.use((req, res, next) => {
	res.locals.messages = {
		error: req.flash('error'),
		success: req.flash('success')
	};
	next();
});

// Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Permite sobrescrever métodos POST e GET
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

// Configuração da View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rotas (devem vir após todos os middlewares)
import tasksRoutes from './src/routes/tasksRoutes.js';
app.use('/', tasksRoutes);

// Tratamento de erros
app.use((_req, res) => {
	res.status(404).render('404');
});

app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).render('500');
});

export default app;
