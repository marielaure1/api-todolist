import { validationResult } from 'express-validator';
import Task from '../models/Task.js';

export default {
  async create(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { title, body, completed } = req.body;

      const { userId } = res
      const createdAt = Date.now();

      const task = new Task({ userId, title, body, createdAt, completed });
      await task.save();

      return res.status(201).json({ success: true, message: 'Tâche créée avec succès', data: task });
    } catch (error) {
      console.error("Task > Create : ", error);
      return res.status(500).json({ success: false, message: 'Erreur lors de la création de la tâche' });
    }
  },

  async findAll(req, res) {
    try {
      const tasks = await Task.find();
      return res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      console.error("Task > FindAll : ", error);
      return res.status(500).json({ success: false, message: 'Erreur serveur interne' });
    }
  },

  async findOne(req, res) {

    const { id } = req.params;
    
    try {
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ success: false, message: 'Tâche non trouvée' });
      }

      return res.status(200).json({ success: true, data: task });
    } catch (error) {
      console.error("Task > FindOne : ", error);
      return res.status(500).json({ success: false, message: 'Erreur serveur interne' });
    }
  },

  async update(req, res) {
    const errors = validationResult(req);
    const { id } = req.params;

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { title, body, completed } = req.body;

      const { userId } = res
      const updatedAt = Date.now();

      const task = await Task.findByIdAndUpdate(id, { userId, title, body, updatedAt, completed });

      if (!task) {
        return res.status(404).json({ success: false, message: 'Tâche non trouvée' });
      }

      return res.status(200).json({ success: true, message: 'Tâche mise à jour avec succès', data: task });
    } catch (error) {
      console.error("Task > Update : ", error);
      return res.status(400).json({ success: false, message: 'Erreur lors de la mise à jour de la tâche' });
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    try {
      const task = await Task.findByIdAndRemove(id);

      if (!task) {
        return res.status(404).json({ success: false, message: 'Tâche non trouvée' });
      }

      return res.status(200).json({ success: true, message: 'Tâche supprimée avec succès' });
    } catch (error) {
      console.error("Task > Delete : ", error);
      return res.status(500).json({ success: false, message: 'Erreur serveur interne' });
    }
  },
};
