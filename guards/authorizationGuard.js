import Task from '../models/Task.js';

export default {
    async authorizationTask(req, res, next) {
        const {userId} = res;

        const taskId = req.params.id;
      
        try{
            const task = await Task.findById(taskId);

            if (!task) {
                return res.status(404).json({ message: "Tâche non trouvée" });
            }
            
            if (task.userId.toString() !== userId) {
                return res.status(403).json({ message: "Vous n'avez pas accès à cette tâche" });
            }

            next();
        } catch(error) {
            console.log(error);
            return res.status(500).json({ message: "Erreur serveur interne" });
        }
    }
}