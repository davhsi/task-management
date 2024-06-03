import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "http://localhost:3001";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });
      setToken(response.data.token);
      fetchTasks();
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await axios.post(`${API_BASE_URL}/signup`, { username, password });
      handleLogin();
    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: token },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error.message);
    }
  };

  const handleTaskCreate = async () => {
    try {
      await axios.post(`${API_BASE_URL}/tasks`, newTask, {
        headers: { Authorization: token },
      });
      fetchTasks();
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Failed to create task:", error.message);
    }
  };

  return (
    <div className="App">
      <h1>Task Management System</h1>
      {!token ? (
        <div className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <h2>Signup</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignup}>Signup</button>
        </div>
      ) : (
        <div>
          <h2>Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.title} - {task.description}
              </li>
            ))}
          </ul>
          <div className="task-form">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <button onClick={handleTaskCreate}>Create Task</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
