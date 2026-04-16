import express from "express";
import { connectDB } from "./db";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
};

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.get("/tasks", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("EXEC GetTasks");

    const tasks = result.recordset.map((task) => ({
      id: task.Id,
      title: task.Title,
      description: task.Description,
      completed: task.Completed,
      createdAt: task.CreatedAt,
    }));

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
});


app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "El título es obligatorio" });
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return res.status(400).json({ message: "La descripción debe ser texto" });
  }

  try {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("Title", title)
      .input("Description", description ?? null)
      .execute("CreateTask");

    res.status(201).json({
      message: "Tarea creada correctamente",
      id: result.recordset[0].Id,
      title,
      description: description ?? null,
      completed: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear tarea" });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Id inválido" });
  }

  try {
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("Id", id)
      .execute("ToggleTask");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const task = result.recordset[0];

  res.json({
    id: task.Id,
   title: task.Title,
    description: task.Description,
    completed: task.Completed,
    createdAt: task.CreatedAt,
  });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar tarea" });
    }
  });

  //*Delete*//

  app.delete("/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Id inválido" });
  }

  try {
    const pool = await connectDB();

    await pool
      .request()
      .input("Id", id)
      .execute("SoftDeleteTask");

    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
});


const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor");
  }
};

startServer();

