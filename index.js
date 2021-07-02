'use strict'

const db = firebase.firestore();

const taskForm =  document.getElementById('task-form');

const tasksContainer = document.getElementById('tasks-container');

let editStatus = false;
let id = " ";

function saveTasks (title, desc){
  db.collection('tasks').doc().set({
    title: title,
    description: desc
  });
}

const getTasks = ()=>db.collection('tasks').get();

const onGetTasks = (callback)=> db.collection('tasks').onSnapshot(callback);

const deleteTasks = id => db.collection('tasks').doc(id).delete();

const getTask = id => db.collection('tasks').doc(id).get();

const updateTask = (id, updatedtask) => db.collection('tasks').doc(id).update(updatedtask);

window.addEventListener('DOMContentLoaded', async (e) =>{
  onGetTasks((querySnapshot)=> {
    tasksContainer.innerHTML = "";
    querySnapshot.forEach(doc => {

      const tasks = doc.data();
      tasks.id = doc.id;

      tasksContainer.innerHTML += 
      `<div class="card card-body mt-3 border-primary">
          <h3 class="h5">${tasks.title}</h3>
          <p>${tasks.description}</p>
          <div>
            <button class="btn btn-primary btn-delete" data-id="${tasks.id}">Delete</button>
            <button class="btn btn-secondary btn-edit" data-id="${tasks.id}">Edit</button>
          </div>
      </div>`;

      const btnsDelete = document.querySelectorAll('.btn-delete');
      btnsDelete.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          await deleteTasks(e.target.dataset.id);
        })
      })

      const btnsEdit = document.querySelectorAll('.btn-edit');
      btnsEdit.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          editStatus = true;
          id = doc.id;
          taskForm['task-title'].value = task.title;
          taskForm['task-desc'].value = task.description;
          taskForm['btn-task-form'].innerText = "Update";
        })
      })
    })

  })
  
});

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('task-title');
    const desc = document.getElementById('task-desc');
    
    if(!editStatus){
      await saveTasks(title.value, desc.value);
    }else{
      await updateTask(id, {
        title: title.value,
        description: desc.value
      })
      editStatus= false;
      id=" ";
      taskForm['btn-task-form'].innerText="Save"
    }
    await getTasks();
    
    taskForm.reset();
    title.focus();
    
})


