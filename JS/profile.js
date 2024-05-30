import * as main from './mainLogic.js'

let urlParams = new URLSearchParams(window.location.search)
let userId = urlParams.get('userId')

// SetupUI
main.setupUi()

// Get Posts
main.getPosts(userId)

// Login Functionality
document.getElementById('login-login').addEventListener('click', main.Login)

// Logout Functionality
document.getElementById('logout-btn').addEventListener('click', main.Logout)

// Register Functionality
document.getElementById('register-register').addEventListener('click', main.Register)

// Create A New Post Functionality
document.getElementById('create-new-post-create').addEventListener('click', main.createNewPost)

// Delete Post
document.getElementById('delete-post-delete').addEventListener('click', main.deletePost)

// Update Post
document.getElementById('edit-post-edit').addEventListener('click', main.updatePost)



