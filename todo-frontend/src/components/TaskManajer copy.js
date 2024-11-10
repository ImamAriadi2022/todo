import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5000";

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const fetchTasks = async () => {
        const response = await axios.get(`${API_URL}/tasks`);
        setTasks(response.data.local_tasks);
    };

    const addTask = async () => {
        await axios.post(`${API_URL}/tasks`, { title: newTask });
        setNewTask("");
        fetchTasks();
    };

    const updateTask = async (id, status) => {
        await axios.put(`${API_URL}/tasks/${id}`, { status });
        fetchTasks();
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="App">
            <h1>Task Manager</h1>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New Task"
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.title} - {task.status}
                        <button onClick={() => updateTask(task.id, 'completed')}>Complete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskManager;
