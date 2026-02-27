// aqui eu to definindo o formato de uma tarefa
// tipo: toda task vai ter id, título e se ta concluída ou não
export interface Task {
  id: number;
  title: string;
  done: boolean;
}

// esse array simula um "banco" em meória
// quando reiniciar o servidor, ele zera
export const tasks: Task[] = [];
