import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/task.routes";

// carrega o arquivo .env (se existir) pra eu poder usar variaveis tipo PORT
dotenv.config();

// crio a app do express
const app = express();

// tento pegar a porta do .env; se nao tiver, uso 3000
const PORT = process.env.PORT || 3000;

// libera qualquer origem, sem travar dominio
app.use(cors());

// vou deixar a parte do cors comentada para tentar mexer depois, não sei como arrumar agora, entao vou deixar assim
// aqui eu pego a url do front em producao
// const FRONTEND_URL = process.env.FRONTEND_URL;
//
// lista das origens permitidas
// const allowedOrigins = [
//   "http://localhost:5500",
//   "http://127.0.0.1:5500",
//   FRONTEND_URL
// ].filter(Boolean) as string[];
//
// cors mais fechado: so deixa origem que eu permiti
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // so pode testar no postman ou por essas origens que defini la em cima
//       if (!origin) {
//         callback(null, true);
//         return;
//       }
//
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//         return;
//       }
//
//       callback(new Error("Origem nao permitida no CORS"));
//     }
//   })
// );

// fala pro express entender json no body
app.use(express.json());

// rota de teste so pra ver se ta vivo
app.get("/health", (req, res) => {
  // to retornando status 200 pq deu tudo certo
  res.status(200).json({ message: "API online" });
});

// aqui eu "plugo" as rotas de task com prefixo /tasks
app.use("/tasks", taskRoutes);

// inicia o servidor
app.listen(PORT, () => {
  // mostro no terminal em qual porta subiu
  console.log(`Servidor rodando na porta ${PORT}`);
});
