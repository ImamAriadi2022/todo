import React, { useState, useEffect, useCallback } from 'react';
import tasksData from '../data.json';
import axios from 'axios';
import { Container, Row, Col, Button, Form, ListGroup, InputGroup } from 'react-bootstrap';

const API_URL = "https://jsonplaceholder.typicode.com";

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [additionalTasks, setAdditionalTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const fetchTasks = () => {
        setTasks(tasksData.tasks);
    };

    const fetchAdditionalTasks = useCallback(async () => {
        const response = await axios.get(`${API_URL}/todos`);
        const translatedTasks = response.data.slice(0, 5).map(task => ({
            ...task,
            title: translateTitle(task.title),
        }));
        setAdditionalTasks(translatedTasks);
    }, []);

    const translateTitle = (title) => {
        const translations = {
            "delectus aut autem": "Lakukan tugas segera",
            "quis ut nam facilis et officia qui": "Selesaikan laporan mingguan",
            "fugiat veniam minus": "Berikan persetujuan klien",
            "et porro tempora": "Siapkan presentasi",
            "laboriosam mollitia et enim quasi adipisci quia provident illum": "Perbarui data inventaris"
        };
        return translations[title] || title;
    };

    const addTask = () => {
        const newTaskObj = {
            id: tasks.length + 1,
            title: newTask,
            status: 'belum selesai'
        };
        setTasks([...tasks, newTaskObj]);
        setNewTask("");
    };

    const addAdditionalTaskToTasks = (task) => {
        const newTaskObj = {
            id: tasks.length + 1,
            title: task.title,
            status: 'belum selesai'
        };
        setTasks([...tasks, newTaskObj]);
        setAdditionalTasks(additionalTasks.filter(t => t.id !== task.id)); // Remove from additionalTasks
    };

    const updateTaskStatus = (id, status) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, status } : task
        );
        setTasks(updatedTasks);
    };

    const updateTaskTitle = (id, newTitle) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, title: newTitle } : task
        );
        setTasks(updatedTasks);
    };

    const deleteTask = (id) => {
        const filteredTasks = tasks.filter(task => task.id !== id);
        setTasks(filteredTasks);
    };

    useEffect(() => {
        fetchTasks();
        fetchAdditionalTasks();
    }, [fetchAdditionalTasks]);

    return (
        <Container 
            fluid 
            className="bg-dark text-white d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: '100vh', padding: '40px 0' }}
        >
            <h1 className="mb-4 text-center">Pengelola Tugas</h1>

            <Row className="mb-4 w-100" style={{ maxWidth: '600px' }}>
                <Col>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Tugas Baru"
                            className="bg-dark text-white"
                        />
                        <Button variant="success" onClick={addTask}>Tambah Tugas</Button>
                    </InputGroup>
                </Col>
            </Row>

            <h2 className="text-center mb-3">Tugas Saya</h2>
            <ListGroup className="mb-4 w-100" style={{ maxWidth: '600px' }}>
                {tasks.map(task => (
                    <ListGroup.Item key={task.id} className="bg-dark text-white d-flex align-items-center">
                        <Form.Control
                            type="text"
                            value={task.title}
                            onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                            className="bg-dark text-white flex-grow-1"
                        />
                        <Button
                            variant="outline-success"
                            className="ms-2"
                            onClick={() => updateTaskStatus(task.id, 'selesai')}
                        >
                            Selesai
                        </Button>
                        <Button
                            variant="outline-danger"
                            className="ms-2"
                            onClick={() => deleteTask(task.id)}
                        >
                            Hapus
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <h2 className="text-center mb-3">Saran Tugas Tambahan</h2>
            <ListGroup className="w-100" style={{ maxWidth: '600px' }}>
                {additionalTasks.map(task => (
                    <ListGroup.Item key={task.id} className="bg-dark text-white d-flex align-items-center">
                        <span className="flex-grow-1">{task.title} - {task.completed ? "Selesai" : "Belum Selesai"}</span>
                        <Button
                            variant="outline-primary"
                            onClick={() => addAdditionalTaskToTasks(task)}
                        >
                            Tambah ke Tugas Saya
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default TaskManager;
