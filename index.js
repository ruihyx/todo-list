
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const pendingList = document.querySelector('#pending-list');
const completedList = document.querySelector('#completed-list');

/*--------------------APIs-----------------------*/

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
  
/*--------------------Model-----------------------*/
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
  

/*--------------------View-----------------------*/
  const View = (() => {
    const createListItem = (todo) => {
      const listItem = document.createElement('li');
      const content = document.createElement('span');
      content.innerText = todo.content;
  
      const editBtn = document.createElement('button');
      editBtn.classList.add('edit-btn')
      editBtn.innerHTML = `
          <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="Edit">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
          </svg>`;
  
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.innerHTML = `
          <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="Delete">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
          </svg>`;
  
      const moveBtn = document.createElement('button');
      moveBtn.classList.add('move-btn');
      const arrowIconPath = todo.completed
        ? 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'
        : 'm12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z';
      moveBtn.innerHTML = `
          <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="Move">
            <path d="${arrowIconPath}"></path>
          </svg>`;
  
      if (todo.completed) {
        listItem.appendChild(content);
        listItem.appendChild(moveBtn);
        listItem.appendChild(deleteBtn);
        completedList.appendChild(listItem);
      } else {
        listItem.appendChild(content);
        listItem.appendChild(editBtn);
        listItem.appendChild(deleteBtn);
        listItem.appendChild(moveBtn);
        pendingList.appendChild(listItem);
      }
  
      return { listItem, editBtn, deleteBtn, moveBtn };
    };
  
    return { createListItem };
  })();
  
  
  
/*--------------------Controller-----------------------*/
const Controller = (() => {
  const addTodo = (todo) => {
    const { listItem, editBtn, deleteBtn, moveBtn } = View.createListItem(todo);
    let editing = false;

    editBtn.addEventListener('click', () => {
      if (!editing) {
        const contentElement = listItem.querySelector('span');
        const inputElement = document.createElement('input');
        inputElement.value = contentElement.innerText;
        inputElement.style.width = '70%';
        listItem.insertBefore(inputElement, contentElement);
        contentElement.style.display = 'none';
        inputElement.focus();
        editing = true;
      } else {
        const inputElement = listItem.querySelector('input');
        const newContent = inputElement.value.trim();
        if (newContent !== '') {
          APIs.updateTodo(todo.id, { content: newContent }).then(() => {
            const contentElement = listItem.querySelector('span');
            contentElement.innerText = newContent;
            contentElement.style.display = '';
            listItem.removeChild(inputElement);
            todo.content = newContent; // Update the todo object
          });
        }
        editing = false;
      }
    });

    deleteBtn.addEventListener('click', () => {
      APIs.deleteTodo(todo.id).then(() => {
        listItem.remove();
      });
    });

    moveBtn.addEventListener('click', () => {
        if (listItem.parentNode === pendingList) {
          completedList.appendChild(listItem);
          todo.completed = true;
          editBtn.style.display = 'none'; // Hide the edit button in the completed list
      
          // Move the moveBtn to the beginning of the listItem (most left)
          listItem.removeChild(moveBtn);
          listItem.insertBefore(moveBtn, listItem.firstChild);
        } else {
          pendingList.appendChild(listItem);
          todo.completed = false;
          editBtn.style.display = ''; // Show the edit button in the pending list
      
          // Move the moveBtn to the end of the listItem (most right)
          listItem.removeChild(moveBtn);
          listItem.appendChild(moveBtn);
        }
        const arrowIconPath = todo.completed
          ? 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'
          : 'm12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z';
        moveBtn.innerHTML = `
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="Move">
              <path d="${arrowIconPath}"></path>
            </svg>`;
      });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const content = todoInput.value.trim();
    if (content !== '') {
      const newTodo = { content };
      APIs.createTodo(newTodo).then((createdTodo) => {
        addTodo(createdTodo);
        todoInput.value = '';
      });
    }
  };


  const init = () => {
    Model.getInitialData();
    todoForm.addEventListener('submit', handleFormSubmit);
  };

  return { init, addTodo };
})();

Controller.init();


// import Controller from './mvc/controller.js';

// Controller.init();