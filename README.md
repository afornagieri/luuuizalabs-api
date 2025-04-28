# Projeto API - aiqfome

Esta API gerencia clientes e seus produtos favoritos, oferecendo autenticação e operações CRUD para clientes.

---

## 🗂️ Estrutura do Projeto

```
project/
├── __tests__/         # Testes unitários
├── .vscode/           # Configurações do VS Code
├── docs/              # Documentação adicional (Swagger, etc.)
├── src/
│   ├── config/        # Configurações da aplicação
│   ├── controllers/   # Lógica de controle das rotas
│   ├── middlewares/   # Middlewares (autenticação, erros)
│   ├── repositories/  # Acesso aos dados (MySQL)
│   ├── routes/        # Definição das rotas
│   ├── services/      # Regras de negócio
│   ├── utils/         # Utilitários e helpers
│   └── app.js         # Inicialização da aplicação Express
├── .env               # Variáveis de ambiente
├── docker-compose.yaml# Orquestração de containers
├── Dockerfile         # Imagem Docker da API
├── package.json       # Dependências e scripts
├── package-lock.json  # Versão exata das dependências
├── README.md          # Documentação do projeto
└── server.js          # Ponto de entrada da aplicação
```

---

## 🚀 Tecnologias

- **Node.js**
- **Express**
- **JWT** (JSON Web Token)
- **MySQL2**
- **Redis**
- **Jest**
- **Swagger UI** (para documentação interativa)

---

## 🏁 Como Rodar o Projeto

### 1. Utilizando Docker

1. Copie o conteúdo do arquivo de exemplo (.env.example) que está na raíz do projeto e configure as variáveis de ambiente.  
2. Crie um arquivo `.env` na raíz do projeto com as credenciais.
3. Inicie os containers:  
   ```bash
   docker-compose up -d
   ```
4. Verifique se os containers estão ativos:  
   ```bash
   docker-compose ps
   ```

A API estará disponível em `http://localhost:3000`.

### 2. Localmente (sem Docker)

1. Instale as dependências:  
   ```bash
   npm install
   ```
2. Configure o `.env` na raiz do projeto.
3. Inicie a aplicação:  
   ```bash
   npm start
   ```
4. Acesse em `http://localhost:3000`.

---

## 📜 Endpoints Principais

| Método | Rota                           | Descrição                           |
| ------ | ------------------------------ | ----------------------------------- |
| POST   | `/auth/login`                  | Autentica usuário e retorna token   |
| GET    | `/clients`                     | Lista todos os clientes             |
| POST   | `/clients`                     | Cria novo cliente                   |
| PUT    | `/clients/:id`                 | Atualiza cliente existente          |
| DELETE | `/clients/:id`                 | Remove cliente                      |

---

## 📄 Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/docs
```

Use as credenciais definidas em `SWAGGER_USER` e `SWAGGER_PASS` no `.env` para se logar e acessar o Swagger.
Na pasta docs na raíz do projeto há dois arquivos, um referente a coleção com os endpoints e o outro com as variáveis de ambiente, caso deseje testar a api via postman.

Obs: Utilize o token gerado pela rota de login no campo onde é esperado o authorization, para poder utilizar as outras rotas (Swagger).
---

## 🧪 Testes

Execute os testes com:

```bash
npm test
```

---

## 👨‍💻 Contribuição

1. Faça um fork deste repositório.  
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`  
3. Commit suas alterações: `git commit -m 'Descrição da mudança'`  
4. Push na branch: `git push origin feature/nova-funcionalidade`  
5. Abra um Pull Request.

---

## Links uteis

- https://www.npmjs.com/package/dotenv
- https://www.npmjs.com/package/mysql2
- https://www.npmjs.com/package/ioredis
- https://hub.docker.com/_/mysql
- https://hub.docker.com/_/redis
- https://jestjs.io/docs/getting-started
- https://mattmazzola.medium.com/how-to-debug-jest-tests-with-vscode-48f003c7cb41 - Debugging with Jest in VS Code
- https://jwt.io/introduction
- https://www.npmjs.com/package/jsonwebtoken
- https://www.npmjs.com/package/swagger-ui
- https://www.npmjs.com/package/express-basic-auth
