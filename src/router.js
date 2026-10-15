
import doadoraController from './controller/doadoraController.js';
import loginController from './controller/loginController.js';
import quizController from './controller/quizController.js';

export function addRoutes(api) {
    api.use(doadoraController);
    api.use(loginController);
    api.use(quizController);
}
