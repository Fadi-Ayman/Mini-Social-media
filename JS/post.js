import * as main from './mainLogic.js'

// Vars
const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get('postId')

main.getPosts(postId)

// setup Ui
main.setupUi()

// Login Functionality
document.getElementById('login-login').addEventListener('click', main.Login)

// Logout Functionality
document.getElementById('logout-btn').addEventListener('click', main.Logout)

// Register Functionality
document.getElementById('register-register').addEventListener('click', main.Register)

// Add Comment
try {
    document.getElementById('Send-comment').addEventListener('click', main.newComment, postId)
} catch (error) {

}

