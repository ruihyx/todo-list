const APIs = (() => {
    const createTodo = (todo) => {
        return fetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify(todo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };
  
    const deleteTodo = (id) => {
        return fetch("http://localhost:3000/todos/" + id, {
            method: "DELETE",
        }).then((res) => res.json());
    };
  
    const getTodos = () => {
        return fetch("http://localhost:3000/todos").then((res) => res.json());
    };
  
    const updateTodo = (id, todo) =>{
        return fetch("http://localhost:3000/todos/" + id, {
            method: "PUT",
            body:JSON.stringify(todo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    }
    return { createTodo, deleteTodo, getTodos, updateTodo };
  })();

  export default APIs;
