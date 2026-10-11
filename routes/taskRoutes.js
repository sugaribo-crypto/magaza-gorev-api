const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);        // Listeleme
router.get('/:id', taskController.getTaskById);     // Detay
router.post('/', taskController.createTask);        // Ekleme
router.put('/:id', taskController.updateTask);      // Güncelleme
router.delete('/:id', taskController.deleteTask);   // Silme

module.exports = router;