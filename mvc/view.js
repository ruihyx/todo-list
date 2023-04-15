import { pendingList, completedList } from './const.js';

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
      

export default View;