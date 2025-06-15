const userController = require('../controllers/userController');
  
    module.exports = (app) => {
      app.post('/api/users/create', userController.register);
      app.post('/api/users/login', userController.login);
      app.get('/api/users/getAll', userController.getAll);
      app.put('/api/users/update', userController.update);
      app.delete('/api/users/delete/:id', userController.delete);
}