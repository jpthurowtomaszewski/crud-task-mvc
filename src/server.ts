import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// carrega o arquivo .env (se existir) pra eu poder usar variaveis tipo PORT
dotenv.config();
// crio a app do express
const app = express();
// tento pegar a porta do .env; se nao tiver, uso 3000
const PORT = process.env.PORT || 3000;
// libera acesso de outras origens (isso evita erro de CORS no front)
app.use(cors());
// fala pro express entender json no body
app.use(express.json());
// rota de teste so pra ver se ta vivo
app.get("/health", (req, res) => {
  // to retornando status 200 pq deu tudo certo
  res.status(200).json({ message: "API online" });
});
// inicia o servidor
app.listen(PORT, () => {
  // mostro no terminal em qual porta subiu
  console.log(`Servidor rodando na porta ${PORT}`);
});
