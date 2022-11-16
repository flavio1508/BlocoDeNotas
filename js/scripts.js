//Seleção de elementos
const todoForm = document.querySelector("#todo-form");//selecionando o elemento formulario
const todoInput = document.querySelector("#todo-input");//adiciona tarefas
const todoList = document.querySelector("#todo-list");//inclui as novas tarefas
const editForm = document.querySelector("#edit-form");//formulario de edição
const editInput = document.querySelector("#edit-input");//campo de edição
const cancelEditBtn = document.querySelector("#cancel-edit-btn");//cancelar edicão
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;
//Funções
const saveTodo = (text) => {//esperando um texto titulo da tarefa
    const todo = document.createElement("div")// criando a di todo done no html
    todo.classList.add("todo")

    const todoTitle = document.createElement("h3")
    todoTitle.innerText = text //inserindo o texto nesse elmento criado
    todo.appendChild(todoTitle)

   const doneBtn = document.createElement("button") //criando botão
   doneBtn.classList.add("finish-todo")//classe finalizar tarefa
   doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';//colocar o icone dentro dele
   todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  todoList.appendChild(todo);

  todoInput.value = "";//apaga o texto da parte de adicionar tarefa
  todoInput.focus();

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

const toggleForms = () => {//esconde um formulario e mostra outro
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
  };

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");//selecionar todos os todo
  
    todos.forEach((todo) => {
      let todoTitle = todo.querySelector("h3");
  
      if (todoTitle.innerText === oldInputValue) {//vendo se e igual o valor salvo na memoria
        todoTitle.innerText = text;
  
        // Utilizando dados da localStorage
        updateTodoLocalStorage(oldInputValue, text);
      }
    });
  };

  const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo");
  
    todos.forEach((todo) => {
      const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
  
      todo.style.display = "flex";
  
      console.log(todoTitle);
  
      if (!todoTitle.includes(search)) {
        todo.style.display = "none";
      }
    });
  };

  const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
  
    switch (filterValue) {
      case "all":
        todos.forEach((todo) => (todo.style.display = "flex"));
  
        break;
  
      case "done":
        todos.forEach((todo) =>
          todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );
  
        break;
  
      case "todo":
        todos.forEach((todo) =>
          !todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );
  
        break;
  
      default:
        break;
    }
  };

// Eventos
todoForm.addEventListener("submit", (e) => {//evento de quando enviar o formulario
    e.preventDefault()//fazer com que o formulario não seja enviado quando pressionar no botão
    const inputValue = todoInput.value//pegar o valor que o usuario digita para criar uma tarefa nova
    if(inputValue){//fazer uma mine validação
        saveTodo(inputValue)//função para salvar
        //salvar o todo
    }
});

document.addEventListener("click", (e)=>{//evento de click nos eventos
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");//selecionou a div mais proximo
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {//titulo
        todoTitle = parentEl.querySelector("h3").innerText || "";
      }

    if (targetEl.classList.contains("finish-todo")){
      parentEl.classList.toggle("done");//adicionando a classe done para os todos que e clicado
      
      updateTodoStatusLocalStorage(todoTitle);
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();//remover o elemento pai
    
        // Utilizando dados da localStorage
        removeTodoLocalStorage(todoTitle);
      }
    
      if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
    
        editInput.value = todoTitle;//mudo o valor do input
        oldInputValue = todoTitle;//salvo
      }

});

cancelEditBtn.addEventListener("click", (e) => {//cancelar edição
    e.preventDefault();
    toggleForms();
  });

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const editInputValue = editInput.value;//valor novo
  
    if (editInputValue) {
        //atualizar
      updateTodo(editInputValue);//manda o valor do input
    }
  
    toggleForms();
  });

  searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
  
    getSearchedTodos(search);
  });
  
  eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
  
    searchInput.value = "";
  
    searchInput.dispatchEvent(new Event("keyup"));
  });
  
  filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;
  
    filterTodos(filterValue);
  });
  
  // Local Storage
  const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
  
    return todos;
  };
  
  const loadTodos = () => {
    const todos = getTodosLocalStorage();
  
    todos.forEach((todo) => {
      saveTodo(todo.text, todo.done, 0);
    });
  };
  
  const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
  
    todos.push(todo);
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    const filteredTodos = todos.filter((todo) => todo.text != todoText);
  
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  };
  
  const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoText ? (todo.done = !todo.done) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoOldText ? (todo.text = todoNewText) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  loadTodos();
  