
// Variables
const baseUrl = 'https://tarmeezacademy.com/api/v1'
const noImage = './images/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'
const noUser = 'images/NoUser.jpg'
let pageNumber = 2;
let loggedInUserId;
if (localStorage.getItem('userInfo') != null) {
  loggedInUserId = JSON.parse(localStorage.getItem('userInfo')).id;
}

// Elements 

let postContainer = document.querySelector('.posts-container')

// ############################################################################################################################
//                                                 Async Functions

// Get Posts Function
export async function getPosts(queryParamValue = 1) {
  // Pathnames vars
  let postPagePathname = '/post-page.html'
  let homePagePathname = '/index.html'
  let profilePagePathname = '/profile.html'

  // Scroll and body Height
  let scrollY = Math.floor(window.scrollY)
  let bodyHeight = Math.floor(document.body.scrollHeight - 766)

  // vars
  let url;
  let addComment = ''
  let postId;
  let loggedInUserId;
  let USERID;


  if (window.location.pathname == profilePagePathname) {
    let urlParams = new URLSearchParams(window.location.search)
    let userId = urlParams.get('userId')
    queryParamValue = userId
    USERID = userId
    url = `${baseUrl}/users/${queryParamValue}/posts`
  } else if (window.location.pathname == postPagePathname) {
    // Get Post Id From URL
    const urlSearchParams = new URLSearchParams(window.location.search)
    postId = urlSearchParams.get('postId')
    queryParamValue = postId
    USERID = postId
    url = `${baseUrl}/posts/${queryParamValue}`

  } else {
    url = `${baseUrl}/posts?page=${queryParamValue}`
  }

  // Sending Request & Validate if Logged In
  let response = await axios.get(url)
  let jsonObj = await response.data
  let posts = jsonObj.data

  let isLogedIn = localStorage.getItem('userInfo') == null ? false : true;
  let userInfo;

  if (isLogedIn) {
    userInfo = JSON.parse(localStorage.getItem('userInfo'))
    loggedInUserId = JSON.parse(localStorage.getItem('userInfo')).id

    if (window.location.pathname == postPagePathname) {
      addComment = `
        <div class="d-flex align-items-center gap-3 mb-3  mr-2 add-comment-section">
        <img  class="profile-img  "  src="${userInfo.profile_image}" >
        <p class="comment-auther mb-0 fw-bold  " >${userInfo.name}</p>
        <div class="comment-input-container " >
        <input type="text" id="add-comment" class="form-control " >
        <button id="Send-comment" onclick="newComment(${postId},this)" class="btn btn-primary" >Send</button>
        </div>
        </div>
        `
    }

  }


  // End Sending Request And isLogin Validate


  if (window.location.pathname == homePagePathname || window.location.pathname == '/') {

    if (scrollY < bodyHeight - 200) {
      postContainer.innerHTML = ''
    }

    for (let post of posts) {
      // Check Variables
      let postSettings = '';
      let isMyPost;

      if (post.image instanceof Object) {
        post.image = noImage
      }

      if (post.author.profile_image instanceof Object) {
        post.author.profile_image = noUser
      }

      if (isLogedIn) {
        isMyPost = userInfo.id == post.author.id ? true : false;
        if (isMyPost) {

          postSettings = `      
            <div class="post-settings">
              <button id="edit-post-btn" data-type="edit" onclick="getPostDetails('${encodeURIComponent(JSON.stringify(post))}',this)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#edit-modal"> Edit </button>
              <button id="delete-post-btn" data-type="delete" onclick="getPostDetails('${encodeURIComponent(JSON.stringify(post))}',this)" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-modal"> Delete </button>
            </div>
            `
        }
      }


      let postContent = `
      <div class="card post-card shadow" >
      <!-- Post Header -->
      <div class="card-header d-flex justify-content-between p-2 align-items-center">
        <!-- Post User Details -->
        <div class="user-details d-flex gap-2 align-items-center justify-content-center"  onclick="goToProfilePage(${post.author.id})" >
          <img src="${post.author.profile_image}" class="profile-img rounded-circle" />
          <p class="fs-6 m-0">${post.author.name}</p>
        </div>
        <!-- Post Settings -->
        ${postSettings}
      </div>
      <!-- End Post Header -->
      <!-- Post Body -->
      <div class="card" onclick="goPostPage(${post.id})" >
        <!-- Post Image -->
        <img src="${post.image}" alt="This User Didn't Upload Image" class="card-img-top post-img" />
        <div id="post-body" class="card-body px-2 py-0 ">
          <!-- Post Time -->
          <p class="card-text post-time m-0 mb-1">
            <small class="text-muted">${post.created_at}</small>
          </p>
          <!-- Post Title -->
          <h5 class="card-title mb-2 post-title">
            ${post.title || ""}
          </h5>
          <!-- Post Body -->
          <p class="card-text post-body m-0 mb-1">
            ${post.body || ""}
          </p>
          <!-- Comment and Tags Section -->
          <div class="comment-tags card-text pt-3 d-flex align-items-center gap-3 mb-3">
            <!-- Comment Section -->
            <div class="comment-section">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                viewBox="0 0 16 16">
                <path
                  d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
              </svg>
              (${post.comments_count}) Comments
            </div>
          </div>
        </div>
      </div>
      <!-- End Post Body -->
    </div>
      `

      postContainer.innerHTML += postContent

    }




  } else if (window.location.pathname == postPagePathname) {
    // User Post
    let post = posts
    let postComments = post.comments
    let comments = ''


    // Add Comments If Exists
    for (let i = 0; i < postComments.length; i++) {
      if (postComments[0] != undefined) {
        comments += `
        <!-- Comment Start -->
        <div class="comment d-flex align-items-center gap-3 py-2  " >
          <img class="profile-img" src="${postComments[i].author.profile_image || noUser}" >
          <p class="comment-auther mb-0 fw-bold " >${postComments[i].author.name}</p>
          <p class="mb-0 comment-body">${postComments[i].body} </p>
        </div>
        <!-- Comment End -->
        `
      }
    }

    // Check Variables
    // prepare Settings of Post
    let postSettings = '';
    let isMyPost;

    if (post.image instanceof Object) {
      post.image = noImage
    }

    if (post.author.profile_image instanceof Object) {
      post.author.profile_image = noUser
    }

    if (isLogedIn) {
      isMyPost = userInfo.id == post.author.id ? true : false;
      if (isMyPost) {

        // postSettings = `      
        //   <div class="post-settings">
        //     <button id="edit-post-btn" data-type="edit" onclick="getPostDetails('${encodeURIComponent(JSON.stringify(post))}',this)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#edit-modal"> Edit </button>
        //     <button id="delete-post-btn" data-type="delete" onclick="getPostDetails('${encodeURIComponent(JSON.stringify(post))}',this)" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-modal"> Delete </button>
        //   </div>
        //   ` 
      }
    }


    // Get User Post
    postContainer.innerHTML = `
    <!-- Post Card -->
    <div class="card post-card shadow">
      <!-- Post Header -->
      <div class="card-header d-flex justify-content-between p-2 align-items-center">
        <!-- Post User Details -->
        <div class="user-details d-flex gap-2 align-items-center justify-content-center" onclick="goToProfilePage(${post.author.id})">
          <img src="${post.author.profile_image}" class="profile-img rounded-circle" />
          <p class="fs-6 m-0">${post.author.name}</p>
        </div>
        ${postSettings}
      </div>
      <!-- End Post Header -->
      <!-- Post Body -->
      <div class="card">
        <!-- Post Image -->
        <img src="${post.image}" class="card-img-top post-img" />
        <div class="card-body px-0 py-0 ">
          <!-- Post Time -->
          <p class="card-text post-time m-0 mb-1 px-2">
            <small class="text-muted">${post.created_at}</small>
          </p>
          <!-- Post Title -->
          <h5 class="card-title mb-2 post-title px-2">
            ${post.title || ''}
          </h5>
          <!-- Post Body -->
          <p class="card-text post-body m-0 mb-1 px-2">
          ${post.body || ''}
          </p>

          <!-- Comment and Tags Section -->
          <div class="comment-tags card-text pt-3 d-flex align-items-center gap-3 mb-3 px-2">
            <!-- Comment Section -->
            <div class="comment-section">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                viewBox="0 0 16 16">
                <path
                  d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
              </svg>
              (${post.comments_count}) Comments
            </div>
          </div>

          <!-- Show Comments and ADD Comment Section -->
          <div class=" comments-addComment  d-flex flex-column justify-content-center px-2 " >

            <!-- Start Comments -->
            ${comments}
            <!-- End Comments -->

            
            <!-- Start Add Comment -->
            ${addComment}
            <!-- End Add Comment -->


          </div>
        </div>
      </div>
      <!-- End Post Body -->
    </div>
    <!-- End Post Card -->
    `


  } else {

    // Get UserDetails Using CallBack Funcrion Inside GetPosts Function
    let userDetails = await getUserdetails(USERID)

    // Vars
    let commentsCount = 0;
    // Validate if no Profile Image
    if (userDetails.profile_image instanceof Object) {
      userDetails.profile_image = noUser
    }


    // Setting Profile Details
    document.querySelector('.profile-details-img').src = userDetails.profile_image;
    document.querySelector('.profile-details-name').innerHTML = userDetails.name || 'No Name';
    document.querySelector('.profile-details-username').innerHTML = userDetails.username || 'No UserName';
    document.querySelector('.profile-details-email').innerHTML = userDetails.email || 'No Email';
    document.querySelector('.profile-posts-count').innerHTML = ` ${userDetails.posts_count || 0} <small class="fs-6 text-secondary ">Posts</small> `;

    if (isLogedIn) {
      if (userDetails.name == userInfo.name) {
        document.querySelector('.owner-title').innerHTML = `My Posts`;
      } else {
        document.querySelector('.owner-title').innerHTML = `${userDetails.name}'s Posts` || `${userDetails.username} Posts`;
      }
    } else {
      document.querySelector('.owner-title').innerHTML = `${userDetails.name}'s Posts` || `${userDetails.username} Posts`;
    }

    posts.reverse()

    postContainer.innerHTML = ''

    for (let post of posts) {

      // Check Variables
      let postSettings = '';
      let isMyPost;

      if (post.image instanceof Object) {
        post.image = noImage
      }

      if (post.author.profile_image instanceof Object) {
        post.author.profile_image = noUser
      }

      if (isLogedIn) {
        isMyPost = userInfo.id == post.author.id ? true : false;
        if (isMyPost) {

          postSettings = `      
            <div class="post-settings">
              <button id="edit-post-btn" data-type="edit" onclick="getPostDetails('${encodeURIComponent(JSON.stringify(post))}',this)" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#edit-modal"> Edit </button>
              <button id="delete-post-btn" data-type="delete" onclick="getPostDetails('${encodeURIComponent(JSON.stringify(post))}',this)" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-modal"> Delete </button>
            </div>
            `
        }
      }


      let postContent = `
      <div class="card post-card shadow" >
      <!-- Post Header -->
      <div class="card-header d-flex justify-content-between p-2 align-items-center">
        <!-- Post User Details -->
        <div class="user-details d-flex gap-2 align-items-center justify-content-center"  onclick="goToProfilePage(${post.author.id})" >
          <img src="${post.author.profile_image}" class="profile-img rounded-circle" />
          <p class="fs-6 m-0">${post.author.name}</p>
        </div>
        <!-- Post Settings -->
        ${postSettings}
      </div>
      <!-- End Post Header -->
      <!-- Post Body -->
      <div class="card" onclick="goPostPage(${post.id})" >
        <!-- Post Image -->
        <img src="${post.image}" alt="This User Didn't Upload Image" class="card-img-top post-img" />
        <div id="post-body" class="card-body px-2 py-0 ">
          <!-- Post Time -->
          <p class="card-text post-time m-0 mb-1">
            <small class="text-muted">${post.created_at}</small>
          </p>
          <!-- Post Title -->
          <h5 class="card-title mb-2 post-title">
            ${post.title || ""}
          </h5>
          <!-- Post Body -->
          <p class="card-text post-body m-0 mb-1">
            ${post.body || ""}
          </p>
          <!-- Comment and Tags Section -->
          <div class="comment-tags card-text pt-3 d-flex align-items-center gap-3 mb-3">
            <!-- Comment Section -->
            <div class="comment-section">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
                viewBox="0 0 16 16">
                <path
                  d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
              </svg>
              (${post.comments_count}) Comments
            </div>
          </div>
        </div>
      </div>
      <!-- End Post Body -->
    </div>
      `

      postContainer.innerHTML += postContent
      commentsCount += +post.comments_count

    }
    document.querySelector('.profile-comment-count').innerHTML = ` ${commentsCount || 0} <small class="fs-6 text-secondary ">Comments</small> `;



  }


}

// Login Function
export async function Login() {

  let url = `${baseUrl}/login`

  let username = document.getElementById('login-username').value
  let password = document.getElementById('login-password').value

  let params = {
    'username': username,
    'password': password,
  }

  let config = {
    'headers': {
      'Content-Type': 'application/json'
    }
  }

  try {
    let response = await axios.post(url, params, config)
    let data = await response.data

    localStorage.setItem('token', data.token)
    localStorage.setItem('userInfo', JSON.stringify(data.user))

    showAlert("Logged In Successfully", "success")

    document.getElementById('login-close').click()

    getPosts()
    setupUi()

    loggedInUserId = JSON.parse(localStorage.getItem('userInfo')).id

  } catch (error) {

    let msg = error.response.data.message

    showAlert(msg, 'danger')
  }
}

// Logout 
export function Logout() {
  localStorage.clear()
  setupUi()
  getPosts()
  showAlert('Logged Out Succecsfully', 'success')
}

// Register Function
export async function Register() {

  const url = `${baseUrl}/register`;
  const headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'multipart/form-data'
  }


  let name = document.getElementById('register-name').value;
  let username = document.getElementById('register-username').value;
  let email = document.getElementById('register-email').value;
  let password = document.getElementById('register-password').value;
  let image = document.getElementById('register-image').files[0];

  const params = new FormData()
  params.append('username', username)
  params.append('password', password)
  params.append('image', image)
  params.append('name', name)
  params.append('email', email)

  try {

    let response = await axios.post(url, params, headers)

    let data = await response.data

    localStorage.setItem('token', data.token)
    localStorage.setItem('userInfo', JSON.stringify(data.user))


    document.getElementById('register-close').click()

    showAlert("Registered Successfully", "success")

    getPosts()
    setupUi()

    loggedInUserId = JSON.parse(localStorage.getItem('userInfo')).id



  } catch (error) {

    let msg = error.response.data.message

    showAlert(msg, 'danger')

  }
}

// Create A New Post
export async function createNewPost() {

  let url = `${baseUrl}/posts`
  let token = localStorage.getItem('token')

  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    }
  }

  let title = document.getElementById('post-title-inp').value;
  let body = document.getElementById('post-body-inp').value;
  let image = document.getElementById('post-image-inp').files[0];


  let params = new FormData()
  params.append('title', title)
  params.append('body', body)
  params.append('image', image)


  try {

    let response = await axios.post(url, params, config)

    let data = await response.data
    getPosts()
    showAlert('The Post Created Successfully', 'success')
    document.getElementById('create-new-post-close').click()

    title = ''
    body = ''



  } catch (error) {

    let msg = error.response.data.message

    showAlert(msg, 'danger')

  }

}

// Delete Post Function
export async function deletePost() {
  let deletedPostId = document.getElementById('delete-post-id-inp').value
  let url = `${baseUrl}/posts/${deletedPostId}`
  let token = localStorage.getItem('token')

  try {

    let response = await axios.delete(url, {
      'headers': {
        'Authorization': `Bearer ${token}`
      }

    })

    document.getElementById('delete-post-close').click()
    showAlert('The Post Deleted Successfully', 'success')
    deletedPostId = ''
    getPosts()

  } catch (error) {

    msg = error.response.data.message
    showAlert(msg, 'danger')
  }

}

// Edit Post Function
export async function updatePost() {

  let postId = document.getElementById('edit-post-id-inp').value
  let url = `${baseUrl}/posts/${postId}`
  let token = localStorage.getItem('token')
  let formData = new FormData()

  let config = {
    "headers": {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  }

  let editTitleInp = document.getElementById('edit-post-title-inp').value
  let editBodyInp = document.getElementById('edit-post-body-inp').value
  let editImageInp = document.getElementById('edit-post-image-inp').files[0]


  formData.append('title', editTitleInp)
  formData.append('body', editBodyInp)
  formData.append('image', editImageInp)
  formData.append('_method', 'put')


  try {

    let response = await axios.post(url, formData, config)

    getPosts()
    document.getElementById('edit-post-close').click()
    showAlert('The Post Has Been Updated Successfully', 'success')

    editTitleInp = '';
    editBodyInp = ''


  } catch (error) {

    const msg = error.response.data.message
    showAlert(msg, 'danger')
  }

}

// Get A Specific User Details 
async function getUserdetails(userId) {
  let url = `${baseUrl}/users/${userId}`

  let response = await axios.get(url)
  let userDetails = response.data.data

  return userDetails
}



// ############################################################################################################################
//                                                 Normal Functions


// Put UserId in Url as Param When go to his profile
function goToProfilePage(authorId) {

  if (authorId == loggedInUserId) {
    window.location = `./profile.html?userId=${loggedInUserId}`
  } else {
    window.location = `./profile.html?userId=${authorId}`
  }
}

// Profile Page Event
document.getElementById("profile-page").addEventListener('click', () => {
  goToProfilePage(loggedInUserId)
})
// End Profile page Event


// Show Alert Function //-- Using bootStrap Colors
function showAlert(message, color) {
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

  const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  alert(message, color)


  setTimeout(() => {
    alertPlaceholder.innerHTML = ''
  }, 3000);

}

// Infinte Scroll Function
export function infiniteScroll() {
  let scrollY = Math.floor(window.scrollY)
  let bodyHeight = Math.floor(document.body.scrollHeight - 766)

  if (scrollY > bodyHeight - 200) {
    getPosts(pageNumber)
    pageNumber++

    window.removeEventListener('scroll', infiniteScroll)

    setTimeout(() => {
      window.addEventListener('scroll', infiniteScroll)
    }, 1000);
  }
}

// SetupUi 
export function setupUi() {

  if (localStorage.getItem('token') != null) {
    // User Is Logged In
    // Show & Hide btns
    document.querySelector('.login-register').style.setProperty('display', 'none', 'important')
    document.querySelector('.logout-profilePic').style.setProperty('display', 'flex', 'important')
    document.getElementById('profile-page').style.setProperty('display', 'flex', 'important')


    try {
      document.getElementById('new-post-btn').style.setProperty('display', 'block', 'important')
    } catch (error) {

    }

    // Setting Profile Information in navBar
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    document.querySelector('.profile-img').src = userInfo.profile_image;
    document.querySelector('.profile-name').innerHTML = userInfo.name


  } else {
    // User Is Logged Out
    // Show & Hide btns
    document.querySelector('.logout-profilePic').style.setProperty('display', 'none', 'important')
    document.querySelector('.login-register').style.setProperty('display', 'flex', 'important')
    document.getElementById('profile-page').style.setProperty('display', 'none', 'important')


    try {
      document.getElementById('new-post-btn').style.setProperty('display', 'none', 'important')
    } catch (error) {

    }

  }

}




