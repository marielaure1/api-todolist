import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const { BASE_URL } = process.env

axios.defaults.baseURL = BASE_URL + "api";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.debug = true;


describe('Tâches All', () => {
  let token2;
  let idUser2;
  let taskId2;

  beforeAll(async () => {
      
    let userData = {
      name: "Marie-Laure",
      email: "ang3liks@gmail.com",
      password: "Marielaudre14",
    };

    let loginResponse = await axios.post('/auth/login', {
      email: userData.email,
      password: userData.password,
    });

    console.log(loginResponse);

    token2 = loginResponse.data.token;
    idUser2 = loginResponse.data.user._id;

    console.log(token2);

  });

  describe('Tâches', () => {

    it('Création de tâche réussie', async () => {

      console.log(token2);
      
      const taskData = {
        title: 'Nouvelle tâche',
        body: 'Description de la tâche',
        completed: false,
      };

      const response = await axios.post('/tasks', taskData, {
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('success', true);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('data');

      taskId2 = response.data.data._id
    });

    it('Création de tâche - Erreur de validation Title', async () => {
      const invalidTaskData = {
        body: 'Description de la tâche',
        completed: false,
      };

      try {
        await axios.post('/tasks', invalidTaskData, {
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });

      } catch (e) {
        expect(e.response.status).toBe(422);
        expect(e.response.data).toHaveProperty('errors');
      }

    });

    it('Création de tâche - Erreur de validation Body', async () => {
      const invalidTaskData = {
        title: 'Nouvelle tâche',
        completed: false,
      };

      try {
        await axios.post('/tasks', invalidTaskData, {
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });

      } catch (e) {
        expect(e.response.status).toBe(422);
        expect(e.response.data).toHaveProperty('errors');
      }

    });

    it('Création de tâche - Erreur de validation Completed', async () => {
      const invalidTaskData = {
        title: 'Nouvelle tâche',
        body: 'Description de la tâche',
        completed: 'Type invalide'
      };

      try {
        await axios.post('/tasks', invalidTaskData, {
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });

        
      } catch (e) {
        expect(e.response.status).toBe(422);
        expect(e.response.data).toHaveProperty('errors');
      }

    });

    it("Récupération de toutes les tâches - Pas d'autorisation", async () => {
      try {
        await axios.get('/tasks');

      } catch (e) {
        expect(e.response.status).toBe(401);
        expect(e.response.data).toHaveProperty('message');
      }
    });

    it('Récupération de toutes les tâches', async () => {
      const response = await axios.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
      expect(response.data).toHaveProperty('data');
      expect(Array.isArray(response.data.data)).toBe(true);
    });

    it("Récupération d'une tâche par ID - Tâche non trouvée", async () => {
      try {
        await axios.get('/tasks/' + '653ec595339ca47bbf3973ed', {
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });

      } catch (e) {
        expect(e.response.status).toBe(404);
        expect(e.response.data).toHaveProperty('message');
      }
    });

      it("Récupération d'une tâche par ID - Pas d'autorisation", async () => {
      try {
        await axios.get(`/tasks/` + taskId2);
      
      } catch (e) {
        expect(e.response.status).toBe(401);
        expect(e.response.data).toHaveProperty('message');
      }
    });

    it("Récupération d'une tâche par ID", async () => {
      const response = await axios.get(`/tasks/` + taskId2, {
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
      expect(response.data).toHaveProperty('data');

    });

    it('Mise à jour de tâche - Tâche non trouvée', async () => {
      const updatedTaskData = {
        title: 'Tâche mise à jour',
        body: 'Description mise à jour',
        completed: true,
      };

      try {
        await axios.put('/tasks/' + '653ec595339ca47bbf3973ed', updatedTaskData, {
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });
      } catch (e) {
        expect(e.response.status).toBe(404);
        expect(e.response.data).toHaveProperty('message');
      }

    });

    it('Mise à jour de tâche réussie', async () => {

      const updatedTaskData = {
        title: 'Tâche mise à jour',
        body: 'Description mise à jour',
        completed: true,
      };

      const response = await axios.put("/tasks/" + taskId2, updatedTaskData, {
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('data');

    });

    it('Suppression de tâche - Tâche non trouvée', async () => {
      try {
        await axios.delete('/tasks/' + '653ec595339ca47bbf3973ed', {
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });

      } catch (e) {
        expect(e.response.status).toBe(404);
        expect(e.response.data).toHaveProperty('message');
      }

    });

    it('Suppression de tâche réussie', async () => {
      const response = await axios.delete(`/tasks/` + taskId2, {
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('success', true);
      expect(response.data).toHaveProperty('message');

    });
  });
});