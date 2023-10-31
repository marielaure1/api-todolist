import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();
const { BASE_URL } = process.env

axios.defaults.baseURL = BASE_URL + "api";
axios.defaults.headers.common["Content-Type"] = "application/json";

describe('Tâches', () => {

  let token;
  let tokenAuth;
  let idUser;

afterAll(async () => {

  await axios.delete('/test/user/' + "edjour.dev@gmail.com");

});

describe('Inscription', () => {

  it("erreur validation - tous les champs sont vides", async () => {
  
    try {
      const userData = {};
      const response = await axios.post("/auth/signup", userData);
      
    } catch(e){
      expect(e.response.status).toBe(422);
      expect(e.response.data).toHaveProperty("errors");
    }
  });

  it("erreur validation - email non valide", async () => {
    try {
      const userData = {
        name: "Marie",
        email: "email",
        password: "pass",
      };
      const response = await axios.post("/auth/signup", userData);
      
    } catch(e){
      expect(e.response.status).toBe(422);
      expect(e.response.data).toHaveProperty("errors");
    }
  });

  it("erreur validation - mot de passe non valide", async () => {
    try {
      const userData = {
        name: "Marie",
        email: "email",
        password: "pass",
      };
      const response = await axios.post("/auth/signup", userData);
      
    } catch(e){
      expect(e.response.status).toBe(422);
      expect(e.response.data).toHaveProperty("errors");
    }
  });

  it("erreur validation - email vide", async () => {
    try {
      const userData = {
        name: "Marie",
        password: "pass",
      };
      const response = await axios.post("/auth/signup", userData);
      
    } catch(e){
      expect(e.response.status).toBe(422);
      expect(e.response.data).toHaveProperty("errors");
    }
  });

  it("erreur validation - mot de passe vide", async () => {
    try {
      const userData = {
        name: "Marie",
        email: "invalid-email",
      };
      const response = await axios.post("/auth/signup", userData);
      
    } catch(e){
      expect(e.response.status).toBe(422);
      expect(e.response.data).toHaveProperty("errors");
    }
  });

  
  it("Inscription réussie", async () => {

    const userData = {
      name: "Marie-Laure",
      email: "edjour.dev@gmail.com",
      password: "Marielaudre14",
    };

  let response = await axios.post("/auth/signup", userData);

  token = response.data.data.token;

  console.log(response.data.data.token);

  expect(response.status).toBe(201);
  expect(response.data).toHaveProperty("success");
  expect(response.data).toHaveProperty("message");
  expect(response.data).toHaveProperty("data");
  expect(response.data).toHaveProperty("data.token");
  expect(response.data).toHaveProperty("data.temporaryUser");

  


});

  it("erreur - l'utilisateur existe déjà", async () => {
    
    try{
      const userData = {
        name: "Marie-Laure",
        email: "ang3liks@gmail.com",
        password: "Marielaudre14",
      };

      const response = await axios.post("/auth/signup", userData);

    } catch(e){
      expect(e.response.status).toBe(422);
      expect(e.response.data).toHaveProperty("success");
      expect(e.response.data).toHaveProperty("message");
    }
     
  });

  describe('Activation de compte ', () => {
    console.log("Activation");
  it('Activation de compte - Lien non valide', async () => {

    try {
  
      const response = await axios.post(`/auth/signup/confirm?token=${token + "non-valide"}`);

    } catch (e) {
      expect(e.response.status).toBe(422);
      expect(e.response.data).toHaveProperty('success');
      expect(e.response.data).toHaveProperty('message');

    }
  });

    it('Activation de compte réussie', async () => {


    const userData = {
      name: "Marie-Laure",
      email: "edjour.dev@gmail.com",
      password: "Marielaudre14",
    };

    const response = await axios.post(`/auth/signup/confirm?token=${token}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("success");
    expect(response.data).toHaveProperty("message");
    expect(response.data).toHaveProperty("data");
    expect(response.data).toHaveProperty("data.token");
    expect(response.data).toHaveProperty("data.user");

    tokenAuth = response.data.data.token;
    idUser = response.data.data.user._id;

    console.log(tokenAuth);
    console.log(idUser);
  });

});
  describe('Connexion', () => {

    console.log("Connexion");
  it('Connexion - Données incorrect', async () => {
    try {
      const userData = {};

      const response = await axios.post('/auth/login', userData);
 
    } catch (e) {
      expect(e.response.status).toBe(422);
      expect(e.response.data).toHaveProperty('errors');
    }
  });

  it('Connexion - Identifiants incorrects', async () => {
    try {
      const userData = {
        email: 'edjour.dev@gmail.com',
        password: 'Marielaudre144545',
      };

      const response = await axios.post('/auth/login', userData);

    } catch (e) {
      expect(e.response.status).toBe(401);
      expect(e.response.data).toHaveProperty('message');
    }
  });

  it('Connexion réussie', async () => {

      const userData = {
        email: 'edjour.dev@gmail.com',
        password: 'Marielaudre14',
      };

      const response = await axios.post('/auth/login', userData);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');

      tokenAuth = response.data.token

  });

});

 
});

});
