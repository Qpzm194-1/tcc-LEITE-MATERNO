
import quiz from './controller/quizController.js';

export function addRoutes(api) {
 
    api.use(quiz);
}