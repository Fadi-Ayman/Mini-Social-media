import * as main from './mainLogic.js'

// Get Posts on Load Home Page
main.getPosts()

// setup Ui
main.setupUi()

// Login Functionality
document.getElementById('login-login').addEventListener('click',main.Login)

// Logout Functionality
document.getElementById('logout-btn').addEventListener('click',main.Logout)

// Register Functionality
document.getElementById('register-register').addEventListener('click',main.Register)

// Create A New Post Functionality
document.getElementById('create-new-post-create').addEventListener('click',main.createNewPost)

// Delete Post
document.getElementById('delete-post-delete').addEventListener('click',main.deletePost)

// Update Post
document.getElementById('edit-post-edit').addEventListener('click',main.updatePost)

// Infinite Scroll
window.addEventListener('scroll',main.infiniteScroll)

