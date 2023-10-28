# Projeto_RESTful_API
Projeto de criação de  uma RESTful API para gerenciar usuários, transações e categorias.



API de Gerenciamento Financeiro:
Esta API foi desenvolvida para fornecer funcionalidades de gerenciamento financeiro, permitindo que usuários realizem operações como cadastrar, visualizar e editar transações, gerenciar categorias, e muito mais.


Database Schema and Initialization:
Este diretório contém scripts SQL para a criação de tabelas e inserção de dados iniciais para a API de gerenciamento financeiro.

Estrutura do Banco de Dados:
Tabela usuarios-
id: Identificador único do usuário (Chave Primária).
nome: Nome do usuário.
email: E-mail do usuário (único).
senha: Senha do usuário.
Tabela categorias
id: Identificador único da categoria (Chave Primária).
descricao: Descrição da categoria.
Tabela transacoes
id: Identificador único da transação (Chave Primária).
descricao: Descrição da transação.
valor: Valor da transação.
data: Data da transação.
categoria_id: ID da categoria associada à transação.
usuario_id: ID do usuário associado à transação.
tipo: Tipo da transação (entrada/saída).
Inicialização dos Dados
Os dados iniciais foram inseridos na tabela categorias para fornecer categorias padrão para as transações.

Categorias Padrão:
Alimentação,
Assinaturas e Serviços,
Casa,
Mercado,
Cuidados Pessoais,
Educação,
Família,
Lazer,
Pets,
Presentes,
Roupas,
Saúde,
Transporte,
Salário,
Vendas,
Outras receitas,
Outras despesas.
Como Usar:
Execute os scripts SQL no seu banco de dados PostgreSQL para criar as tabelas e inserir os dados iniciais.
Configure as credenciais do banco de dados na aplicação conforme necessário.
Observação: Certifique-se de ter um backup ou ambiente de teste antes de executar scripts SQL em um ambiente de produção.

Middleware de Validação de Token:
Como Funciona:
Recebe o Token: O middleware extrai o token do cabeçalho da requisição.
Verificação do Token: Utiliza o módulo jsonwebtoken para verificar a validade do token.
Consulta no Banco de Dados: Obtém o ID do usuário a partir do token e verifica se esse usuário existe no banco de dados.
Usuário Autenticado: Se o usuário for válido, adiciona as informações do usuário (req.usuario) ao objeto de requisição (req) para uso posterior nas rotas.
Erro de Autenticação: Se houver algum problema na autenticação, responde com um código 401 (Não Autorizado).

Adicione o middleware validarToken à rota ou grupo de rotas que requer autenticação. Ele será executado antes dos controladores das rotas, garantindo que apenas usuários autenticados tenham acesso aos recursos protegidos.

Endpoints:
1. Cadastrar Usuário:
Endpoint: /usuario
Método: POST
Descrição: Cadastra um novo usuário com informações como nome, e-mail e senha.

2. Fazer Login:
Endpoint: /login
Método: POST
Descrição: Autentica o usuário com base no e-mail e senha fornecidos, retornando um token de acesso.

3. Detalhar Perfil do Usuário Logado:
Endpoint: /usuario
Método: GET
Descrição: Retorna as informações do perfil do usuário autenticado.

4. Editar Perfil do Usuário Logado:
Endpoint: /usuario
Método: PUT
Descrição: Permite ao usuário autenticado atualizar suas informações, como nome, senha, etc.

5. Listar Categorias:
Endpoint: /categoria
Método: GET
Descrição: Retorna a lista de categorias disponíveis.

6. Listar Transações:
Endpoint: /transacao
Método: GET
Descrição: Retorna a lista de todas as transações do usuário autenticado.

7. Detalhar Transação:
Endpoint: /transacao/:id
Método: GET
Descrição: Retorna os detalhes de uma transação específica com base no ID fornecido.

8. Cadastrar Transação:
Endpoint: /transacao
Método: POST
Descrição: Permite ao usuário criar uma nova transação, incluindo informações como categoria, valor, etc.

9. Editar Transação:
Endpoint: /transacao/:id
Método: PUT
Descrição: Permite ao usuário autenticado editar uma transação existente com base no ID fornecido.

10. Remover Transação:
Endpoint: /transacao/:id
Método: DELETE
Descrição: Remove uma transação específica com base no ID fornecido.

11. Obter Extrato de Transações:
Endpoint: /transacao/extrato
Método: GET
Descrição: Retorna um extrato de todas as transações realizadas pelo usuário em um formato detalhado.

12. Filtrar Transações por Categoria :
Endpoint: /transacao
Método: GET
Descrição: Retorna as transações do usuário autenticado filtradas por uma categoria específica.

Tecnologias Utilizadas:
Node.js
Express.js
PostgreSQL
Bcrypt (para criptografia de senhas)
JSON Web Token (JWT) (para autenticação)
...
Instalação e Uso:
Clone este repositório.
Instale as dependências usando npm install.
Configure o banco de dados PostgreSQL e atualize as configurações no arquivo conexao.js.
Execute a aplicação com npm run dev.
Lembre-se de fornecer as variáveis de ambiente necessárias, como a chave secreta para JWT e outras configurações específicas do ambiente.

Contribuições:
Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas ou enviar solicitações de pull.