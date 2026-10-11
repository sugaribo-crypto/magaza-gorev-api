const { readDB, writeDB, getNextId } = require('../utils/db');

const PRIORITIES = ['DUSUK', 'ORTA', 'YUKSEK', 'ACIL'];
function getAllTasks(req, res) {
  const db = readDB();
  res.json({ success: true, count: db.tasks.length, data: db.tasks });
}

function getTaskById(req, res) {
  const db = readDB();
  const id = Number(req.params.id);
  const task = db.tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı.` });
  }
  res.json({ success: true, data: task });
}

function createTask(req, res) {
  const { title, description, priority } = req.body;
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Başlık (title) zorunludur ve en az 3 karakter olmalıdır.' });
  }
  if (priority && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ success: false, message: `Öncelik şunlardan biri olmalı: ${PRIORITIES.join(', ')}` });
  }
  const db = readDB();
  const now = new Date().toISOString();
  const newTask = {
    id: getNextId(db.tasks),
    title: title.trim(),
    description: description || '',
    status: 'YAPILACAK',           
    priority: priority || 'ORTA',  
    assignedTo: null,
    createdAt: now,
    updatedAt: now,
  };

  db.tasks.push(newTask); 
  writeDB(db);            
  res.status(201).json({ success: true, message: 'Görev oluşturuldu.', data: newTask });
}

function updateTask(req, res) {
  const db = readDB();
  const id = Number(req.params.id);
  const task = db.tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı.` });
  }
  const { title, description, priority } = req.body;
  if (title !== undefined && title.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Başlık en az 3 karakter olmalıdır.' });
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    return res.status(400).json({ success: false, message: `Öncelik şunlardan biri olmalı: ${PRIORITIES.join(', ')}` });
  }

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  task.updatedAt = new Date().toISOString();

  writeDB(db);
  res.json({ success: true, message: 'Görev güncellendi.', data: task });
}

function deleteTask(req, res) {
  const db = readDB();
  const id = Number(req.params.id);
  const task = db.tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ success: false, message: `${id} numaralı görev bulunamadı.` });
  }
  db.tasks = db.tasks.filter((t) => t.id !== id); // bu id dışındakileri tut
  writeDB(db);

  res.json({ success: true, message: `${id} numaralı görev silindi.` });
}
module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };