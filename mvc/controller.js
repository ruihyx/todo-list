import Model from './model.js';
import View from './view.js';
import { todoForm, todoInput, pendingList, completedList } from './const.js';

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
      } else {
        pendingList.appendChild(listItem);
        todo.completed = false;
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


export default Controller;