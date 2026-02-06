// access input field
const input = document.querySelector('#todo-input');

// access filter elements
const filterKeyword = document.querySelector('#filter-keyword');
const filterDate = document.querySelector('#filter-date');
const filterHiddenDate = document.querySelector('#filter-hidden-date');
const filterPriority = document.querySelector('#filter-priority');
const clearFiltersBtn = document.querySelector('#clear-filters');

// Function to format date as DD/MM/YYYY
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to parse DD/MM/YYYY to YYYY-MM-DD
function parseDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

// Listening to click event from "Add" button.
document.querySelector('#submit').addEventListener('click', () => {
  // value of the input field
  const inputData = input.value.trim();
  const dateData = parseDate(document.querySelector('#todo-date').value.trim());
  const priorityData = document.querySelector('#todo-priority').value;
  const descriptionData = document.querySelector('#todo-description').value.trim();

  // Validation
  if (!inputData) {
    showError('todo-input', 'Tugas tidak boleh kosong');
    return;
  } else {
    clearError('todo-input');
  }
  if (!dateData) {
    showError('todo-date', 'Tanggal harus dipilih');
    return;
  } else {
    clearError('todo-date');
  }
  if (!priorityData) {
    showError('todo-priority', 'Prioritas harus dipilih');
    return;
  } else {
    clearError('todo-priority');
  }
  input.value = "";
  document.querySelector('#todo-date').value = "";
  document.querySelector('#todo-priority').value = "";
  document.querySelector('#todo-description').value = "";

  // creating todo item element
  const todo_el = document.createElement('div');
  todo_el.classList.add('todo-item');

  const todo_content_el = document.createElement('div');
  todo_el.appendChild(todo_content_el);

  const todo_input_el = document.createElement('input');
  todo_input_el.classList.add('text');
  todo_input_el.type = 'text';
  todo_input_el.value = inputData;
  todo_input_el.setAttribute('readonly', 'readonly');

  todo_content_el.appendChild(todo_input_el);

  const details_el = document.createElement('div');
  details_el.classList.add('details');
  todo_content_el.appendChild(details_el);

  if (priorityData) {
    const todo_priority_el = document.createElement('span');
    todo_priority_el.classList.add('priority', priorityData);
    todo_priority_el.textContent = priorityData;
    details_el.appendChild(todo_priority_el);
  }

  if (descriptionData) {
    const todo_description_el = document.createElement('div');
    todo_description_el.classList.add('description');
    todo_description_el.textContent = descriptionData;
    details_el.appendChild(todo_description_el);
  }

  if (dateData) {
    const todo_date_el = document.createElement('div');
    todo_date_el.classList.add('date');
    todo_date_el.textContent = `Due: ${formatDate(dateData)}`;
    details_el.appendChild(todo_date_el);
  }

  const todo_actions_el = document.createElement('div');
  todo_actions_el.classList.add('action-items');

  const todo_done_el = document.createElement('i');
  todo_done_el.classList.add('fa-solid');
  todo_done_el.classList.add('fa-check');

  const todo_edit_el = document.createElement('i');
  todo_edit_el.classList.add('fa-solid');
  todo_edit_el.classList.add('fa-pen-to-square');
  todo_edit_el.classList.add('edit');

  const todo_delete_el = document.createElement('i');
  todo_delete_el.classList.add('fa-solid');
  todo_delete_el.classList.add('fa-trash');

  todo_actions_el.appendChild(todo_done_el)
  todo_actions_el.appendChild(todo_edit_el);
  todo_actions_el.appendChild(todo_delete_el);

  todo_el.appendChild(todo_actions_el);
  console.log(todo_el)
  // add the todo-item to lists
  document.querySelector('.todo-lists').appendChild(todo_el);

  // Show clear all button if there are tasks
  updateClearAllButtonVisibility();

  // done functionality
  todo_done_el.addEventListener('click', () => {
    todo_input_el.classList.add('done')
    todo_done_el.classList.add('done-animation');
    setTimeout(() => {
      todo_el.removeChild(todo_actions_el);
    }, 600); // Wait for animation to complete
  })

  // edit functionality
  todo_edit_el.addEventListener('click', (e) => {
    const todo_priority_el = todo_el.querySelector('.priority');
    const todo_description_el = todo_el.querySelector('.description');
    const todo_date_el = todo_el.querySelector('.date');

    if (todo_edit_el.classList.contains("edit")) {
      todo_edit_el.classList.remove("edit");
      todo_edit_el.classList.remove("fa-pen-to-square");
      todo_edit_el.classList.add("fa-x");
      todo_edit_el.classList.add("save");
      todo_input_el.removeAttribute("readonly");
      todo_input_el.focus();

      // Make priority editable
      const prioritySelect = document.createElement('select');
      prioritySelect.innerHTML = `
        <option value="Low" ${todo_priority_el && todo_priority_el.classList.contains('Low') ? 'selected' : ''}>Low</option>
        <option value="Medium" ${todo_priority_el && todo_priority_el.classList.contains('Medium') ? 'selected' : ''}>Medium</option>
        <option value="High" ${todo_priority_el && todo_priority_el.classList.contains('High') ? 'selected' : ''}>High</option>
      `;
      if (todo_priority_el) {
        todo_priority_el.replaceWith(prioritySelect);
      } else {
        todo_content_el.insertBefore(prioritySelect, todo_input_el.nextSibling);
      }

      // Make description editable
      const descriptionTextarea = document.createElement('textarea');
      descriptionTextarea.classList.add('description');
      if (todo_description_el) {
        descriptionTextarea.value = todo_description_el.textContent;
        todo_description_el.replaceWith(descriptionTextarea);
      } else {
        const afterEl = prioritySelect || todo_input_el;
        todo_content_el.insertBefore(descriptionTextarea, afterEl.nextSibling);
      }

      // Make date editable
      const dateInput = document.createElement('input');
      dateInput.type = 'text';
      dateInput.placeholder = 'dd/mm/yyyy';
      const hiddenDateInput = document.createElement('input');
      hiddenDateInput.type = 'date';
      hiddenDateInput.style.display = 'none';
      if (todo_date_el) {
        const dateValue = todo_date_el.textContent.replace('Due: ', '');
        dateInput.value = dateValue;
        hiddenDateInput.value = parseDate(dateValue);
        todo_date_el.replaceWith(dateInput);
        dateInput.insertAdjacentElement('afterend', hiddenDateInput);
      } else {
        const afterEl = descriptionTextarea || prioritySelect || todo_input_el;
        todo_content_el.insertBefore(dateInput, afterEl.nextSibling);
        dateInput.insertAdjacentElement('afterend', hiddenDateInput);
      }
      // Add calendar icon for edit
      const calendarIcon = document.createElement('i');
      calendarIcon.classList.add('fa-solid', 'fa-calendar-days');
      dateInput.insertAdjacentElement('afterend', calendarIcon);
      calendarIcon.addEventListener('click', () => {
        hiddenDateInput.showPicker ? hiddenDateInput.showPicker() : hiddenDateInput.focus();
      });
      hiddenDateInput.addEventListener('change', () => {
        dateInput.value = formatDate(hiddenDateInput.value);
      });
    } else {
      todo_edit_el.classList.remove("save");
      todo_edit_el.classList.remove("fa-x");
      todo_edit_el.classList.add("fa-pen-to-square");
      todo_edit_el.classList.add("edit");
      todo_input_el.setAttribute("readonly", "readonly");

      // Save priority
      const prioritySelect = todo_el.querySelector('select');
      if (prioritySelect) {
        const newPriority = prioritySelect.value;
        if (newPriority) {
          const newPriorityEl = document.createElement('span');
          newPriorityEl.classList.add('priority', newPriority);
          newPriorityEl.textContent = newPriority;
          prioritySelect.replaceWith(newPriorityEl);
        } else {
          prioritySelect.remove();
        }
      }

      // Save description
      const descriptionTextarea = todo_el.querySelector('textarea');
      if (descriptionTextarea) {
        const newDescription = descriptionTextarea.value.trim();
        if (newDescription) {
          const newDescriptionEl = document.createElement('div');
          newDescriptionEl.classList.add('description');
          newDescriptionEl.textContent = newDescription;
          descriptionTextarea.replaceWith(newDescriptionEl);
        } else {
          descriptionTextarea.remove();
        }
      }

      // Save date
      const dateInput = todo_el.querySelector('input[type="date"]');
      if (dateInput) {
        const newDate = dateInput.value;
        if (newDate) {
          const newDateEl = document.createElement('div');
          newDateEl.classList.add('date');
          newDateEl.textContent = `Due: ${formatDate(newDate)}`;
          dateInput.replaceWith(newDateEl);
        } else {
          dateInput.remove();
        }
      }
    }
  });

  // delete functionality
  todo_delete_el.addEventListener('click', (e) => {
    console.log(todo_el);
    todo_el.classList.add('fade-out');
    setTimeout(() => {
      document.querySelector('.todo-lists').removeChild(todo_el);
    }, 300); // Wait for animation to complete
  });
})

// Filter functionality
function filterTodos() {
  const keyword = filterKeyword.value.toLowerCase();
  const dateFilter = filterHiddenDate.value;
  const priorityFilter = filterPriority.value;
  const todos = document.querySelectorAll('.todo-item');

  todos.forEach(todo => {
    const text = todo.querySelector('.text').value.toLowerCase();
    const dateEl = todo.querySelector('.date');
    let todoDate = '';
    if (dateEl) {
      const dateParts = dateEl.textContent.replace('Due: ', '').split('/');
      const day = dateParts[0].padStart(2, '0');
      const month = dateParts[1].padStart(2, '0');
      const year = dateParts[2];
      todoDate = `${year}-${month}-${day}`;
    }
    const priorityEl = todo.querySelector('.priority');
    const todoPriority = priorityEl ? priorityEl.textContent : '';

    let show = true;

    // Filter by keyword
    if (keyword && !text.includes(keyword)) {
      show = false;
    }

    // Filter by date (show only if todo date exactly matches filter date)
    if (dateFilter) {
      if (!todoDate || todoDate !== dateFilter) {
        show = false;
      }
    }

    // Filter by priority
    if (priorityFilter && todoPriority !== priorityFilter) {
      show = false;
    }

    todo.style.display = show ? 'flex' : 'none';
  });
}

// Event listeners for filters
filterKeyword.addEventListener('input', filterTodos);
filterDate.addEventListener('change', () => {
  const parsed = parseDate(filterDate.value);
  filterHiddenDate.value = parsed;
  filterTodos();
});
filterHiddenDate.addEventListener('change', filterTodos);
filterPriority.addEventListener('change', filterTodos);
clearFiltersBtn.addEventListener('click', () => {
  filterKeyword.value = '';
  filterDate.value = '';
  filterHiddenDate.value = '';
  filterPriority.value = '';
  filterTodos();
});

// Make calendar icons clickable to open date pickers
document.querySelectorAll('.fa-calendar-days').forEach(icon => {
  icon.addEventListener('click', () => {
    const inputGroup = icon.parentElement;
    const hiddenDateInput = inputGroup.querySelector('input[type="date"]');
    if (hiddenDateInput) {
      hiddenDateInput.showPicker ? hiddenDateInput.showPicker() : hiddenDateInput.focus();
    }
  });
});

// Make the date input text field clickable to open the calendar
document.querySelector('#todo-date').addEventListener('click', () => {
  const hiddenDateInput = document.querySelector('#hidden-date');
  if (hiddenDateInput) {
    hiddenDateInput.showPicker ? hiddenDateInput.showPicker() : hiddenDateInput.focus();
  }
});

// Clear all tasks functionality
document.querySelector('#clear-all').addEventListener('click', () => {
  const todos = document.querySelectorAll('.todo-item');
  if (todos.length === 0) {
    alert('Tidak ada tugas untuk dihapus');
    return;
  }
  if (confirm('Apakah Anda yakin ingin menghapus semua tugas?')) {
    todos.forEach(todo => {
      todo.classList.add('fade-out');
      setTimeout(() => {
        document.querySelector('.todo-lists').removeChild(todo);
        // Update clear all button visibility after all deletions
        updateClearAllButtonVisibility();
      }, 300);
    });
  }
});

// Function to update clear all button visibility
function updateClearAllButtonVisibility() {
  const todos = document.querySelectorAll('.todo-item');
  const clearAllContainer = document.querySelector('.clear-all-container');
  if (todos.length > 0) {
    clearAllContainer.style.display = 'block';
  } else {
    clearAllContainer.style.display = 'none';
  }
}

// Update text input when hidden date changes
document.querySelector('#hidden-date').addEventListener('change', () => {
  const hiddenDate = document.querySelector('#hidden-date');
  const textDate = document.querySelector('#todo-date');
  if (hiddenDate && textDate) {
    textDate.value = formatDate(hiddenDate.value);
  }
});

// Update filter text input when filter hidden date changes
document.querySelector('#filter-hidden-date').addEventListener('change', () => {
  const hiddenDate = document.querySelector('#filter-hidden-date');
  const textDate = document.querySelector('#filter-date');
  if (hiddenDate && textDate) {
    textDate.value = formatDate(hiddenDate.value);
  }
});

// Function to show error message
function showError(inputId, message) {
  const inputGroup = document.querySelector(`#${inputId}`).closest('.input-group');
  let errorMessage = inputGroup.querySelector('.error-message');
  if (!errorMessage) {
    errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    inputGroup.appendChild(errorMessage);
  }
  errorMessage.textContent = message;
  inputGroup.classList.add('error');
  inputGroup.classList.add('shake');
  setTimeout(() => {
    inputGroup.classList.remove('shake');
  }, 500);
}

// Function to clear error message
function clearError(inputId) {
  const inputGroup = document.querySelector(`#${inputId}`).closest('.input-group');
  inputGroup.classList.remove('error');
  const errorMessage = inputGroup.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.textContent = '';
  }
}

// Add event listeners to clear errors when inputs are filled
document.querySelector('#todo-input').addEventListener('input', () => {
  if (document.querySelector('#todo-input').value.trim()) {
    clearError('todo-input');
  }
});

document.querySelector('#todo-date').addEventListener('input', () => {
  if (document.querySelector('#todo-date').value.trim()) {
    clearError('todo-date');
  }
});

document.querySelector('#todo-priority').addEventListener('change', () => {
  if (document.querySelector('#todo-priority').value) {
    clearError('todo-priority');
  }
});

document.querySelector('#todo-description').addEventListener('input', () => {
  if (document.querySelector('#todo-description').value.trim()) {
    clearError('todo-description');
  }
});
