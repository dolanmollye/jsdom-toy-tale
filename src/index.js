let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  fetchToys()
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector('form')

  toyForm.addEventListener('submit', handleSubmit)

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//Data (get all data for toys)
function fetchToys() {
  fetch(`http://localhost:3000/toys`)
  .then(res => res.json())
  .then(toys => toys.forEach(toy => buildCard(toy)))
}

function postToys(toy) {
  fetch (`http://localhost:3000/toys`,{
    method:'POST',
    headers: 
    {
      "Content-Type": "application/json",
       Accept: "application/json"
    },
    body: JSON.stringify(toy)
  })
  .then(res => res.json())
  .then(toy => buildCard(toy))

}

function updateToy(toy){
  toy.likes++ //update toy likes

  fetch (`http://localhost:3000/toys/${toy.id}`,{
    method:'PATCH',
    headers: 
    {
      "Content-Type": "application/json",
       Accept: "application/json"
    },
    body: JSON.stringify({likes: toy.likes})
  })
  .then(res => res.json())
  .then(toy => {
    //grab specific toy and update likes
    let oldToy = document.getElementById(toy.id)
    let p = oldToy.querySelector('p')
    p.textContent = `${toy.likes} Likes`
  })

}

function deleteToy(id) {
  fetch (`http://localhost:3000/toys/${id}`,{
    method:'DELETE',
  })
  .then(res => res.json())
  .then(() => {
    //grab specific toy and update likes
    let oldToy = document.getElementById(id)
    oldToy.remove()
  })
}

//DOM
function buildCard(toy){
  let div = document.createElement('div')
  let h2 = document.createElement('h2')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let btn = document.createElement('button')
  let deleteBtn = document.createElement('button')
  let toyCollection = document.querySelector('#toy-collection')

  div.className = 'card'
  div.id = toy.id

  img.src = toy.image
  img.className = 'toy-avatar'
  h2.textContent = toy.name
  p.textContent = `${toy.likes} Likes`
  btn.className = 'like-btn'
  btn.textContent = 'Like <3'
  deleteBtn.textContent = 'x'
  
  btn.addEventListener('click', (e) => updateToy(toy))
  deleteBtn.addEventListener('click', (e) => deleteToy(toy.id))
  
  div.append(h2,img,p,btn, deleteBtn)
  toyCollection.appendChild(div)
}

//Handlers
function handleSubmit(e) {
  e.preventDefault()

  let toy = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }

  postToys(toy)
}
