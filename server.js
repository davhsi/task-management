const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());
const users = [];
const tasks = [];
const secretKey = "your_secret_key";
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const user = { id: users.length + 1, username, password };
  users.push(user);
  res.status(201).json({ message: "User signed up successfully" });
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ userId: user.id }, secretKey);
  res.json({ token });
});
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
}
app.get("/tasks", authenticateToken, (req, res) => {
  const userTasks = tasks.filter((task) => task.userId === req.userId);
  res.json(userTasks);
});
app.post("/tasks", authenticateToken, (req, res) => {
  const { title, description } = req.body;
  const task = { id: tasks.length + 1, userId: req.userId, title, description };
  tasks.push(task);
  res.status(201).json({ message: "Task created successfully", task });
});
app.put("/tasks/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }
  if (tasks[taskIndex].userId !== req.userId) {
    return res.status(403).json({
      message: "Forbidden: You are not authorized to update this task",
    });
  }
  tasks[taskIndex] = { ...tasks[taskIndex], title, description };
  res.json({ message: "Task updated successfully", task: tasks[taskIndex] });
});
app.delete("/tasks/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }
  if (tasks[taskIndex].userId !== req.userId) {
    return res.status(403).json({
      message: "Forbidden: You are not authorized to delete this task",
    });
  }
  tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted successfully" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
