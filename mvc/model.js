import APIs from './api.js';

const Model = (() => {
    const getInitialData = () => {
        return APIs.getTodos()
            .then(todos => {
                todos.forEach(todo => {
                    Controller.addTodo(todo);
                });
            });
    };
  
    return { getInitialData };
  })();

export default Model;