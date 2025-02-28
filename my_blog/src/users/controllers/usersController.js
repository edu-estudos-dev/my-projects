import bcrypt from 'bcrypt';
import { models } from '../../models/index.js';

class UserController {
	// Método para renderizar formulário de login
	async showFormLogin(req, res, success) {
		res.render('users/formLogin', { erro: null, success: success || null });
	}

	// Método para renderizar formulário de 1º registro
	async showFormRegister(req, res) {
		res.render('users/register', {
			erro: null,
			success: null
		});
	}

	// Método para criar usuário
	async createUser(req, res) {
		try {
			const { userName, password } = req.body;
			const lowerCaseUser = userName.toLowerCase().trim();

			if (!userName || !password) {
				return res.render('users/register', {
					erro: 'Preencha todos os campos!',
					success: null
				});
			}

			const userExists = await models.Users.findOne({
				where: { userName: lowerCaseUser }
			});

			if (userExists) {
				return res.render('users/register', {
					erro: 'Usuário já cadastrado!',
					success: null
				});
			}

			// --- BLOCO DE CRIPTOGRAFIA ---
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			// ----------------------------

			await models.Users.create({
				userName: lowerCaseUser,
				password: hashedPassword
			});

			return res.render('users/formLogin', {
				success: 'Registro concluído! Redirecionando...',
				erro: null
			});
		} catch (error) {
			console.error('Erro no registro:', error);
			return res.render('users/register', {
				erro: 'Erro interno no servidor',
				success: null
			});
		}
	}

	// Autentica credenciais e inicia sessão do usuário
	async login(req, res) {
		const { userName, password } = req.body;

		// verificação de campos obrigatórios
		if (!userName || !password) {
			return res.render('users/formLogin', {
				erro: 'Usuário ou senha incorretos.'
			});
		}

		try {
			const userLowwerCase = userName.toLowerCase().trim();
			const foundUser = await models.Users.findOne({
				where: { userName: userLowwerCase }
			});

			if (!foundUser) {
				return res.status(400).render('users/formLogin', {
					erro: 'Usuário não cadastrado.'
				});
			}

			// Verificação segura da senha
			const validPassword = await bcrypt.compare(password, foundUser.password);

			if (validPassword) {
				req.session.user = {
					id: foundUser.id
				};
				return res.status(200).redirect('/');
			} else {
				res.render('users/formLogim', {
					erro: 'Senha incorreta'
				});
			}
		} catch (error) {
			console.error('Erro de autenticação:', error);
			return res.render('users/formLogin', {
				erro: 'Erro interno no servidor'
			});
		}
	}

	// Metodo de logout

	logout = (req, res) => {
		req.session.destroy(err => {
			if (err) {
				console.error('Erro ao destruir sessão:', err);
				return res.status(500).render('500');
			}

			// Limpa o cookie COM AS MESMAS OPÇÕES DA SESSÃO
			res.clearCookie('connect.sid', {
				path: '/',
				secure: process.env.NODE_ENV === 'production', // Mesmo valor da sessão
				httpOnly: true,
				sameSite: 'lax'
			});

			res.redirect('/users/login'); 
		});
	};
}

export default new UserController();
