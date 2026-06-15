const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = 3000;

app.use(express.json());

// Dados em memória
let alunos = [
  { id: 1, nome: "João Silva", curso: "Sistemas de Informação" },
  { id: 2, nome: "Maria Souza", curso: "Análise e Desenvolvimento de Sistemas" }
];

// Configuração Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Alunos",
      version: "1.0.0",
      description: "API CRUD de alunos usando Express e Swagger"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./index.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     responses:
 *       200:
 *         description: Lista de alunos
 */
app.get("/alunos", (req, res) => {
  res.status(200).json(alunos);
});

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Busca um aluno pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *       404:
 *         description: Aluno não encontrado
 */
app.get("/alunos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const aluno = alunos.find(a => a.id === id);

  if (!aluno) {
    return res.status(404).json({
      mensagem: "Aluno não encontrado"
    });
  }

  res.status(200).json(aluno);
});

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cadastra um novo aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               curso:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aluno criado
 */
app.post("/alunos", (req, res) => {
  const { nome, curso } = req.body;

  const novoAluno = {
    id: alunos.length > 0 ? alunos[alunos.length - 1].id + 1 : 1,
    nome,
    curso
  };

  alunos.push(novoAluno);

  res.status(201).json(novoAluno);
});

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza um aluno
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               curso:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aluno atualizado
 *       404:
 *         description: Aluno não encontrado
 */
app.put("/alunos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const aluno = alunos.find(a => a.id === id);

  if (!aluno) {
    return res.status(404).json({
      mensagem: "Aluno não encontrado"
    });
  }

  aluno.nome = req.body.nome || aluno.nome;
  aluno.curso = req.body.curso || aluno.curso;

  res.status(200).json(aluno);
});

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Remove um aluno
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Aluno removido
 *       404:
 *         description: Aluno não encontrado
 */
app.delete("/alunos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = alunos.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({
      mensagem: "Aluno não encontrado"
    });
  }

  alunos.splice(index, 1);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});