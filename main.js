let cards = document.getElementById("posts");
let cbody = document.getElementById("c-body");
const logoutBtn = document.getElementById("log-out");
let signUpBut = document.getElementById("signUpButton");
let accessPlus = document.getElementById("access");
let loginbut = document.getElementById("loginButton");
const posTitle = document.getElementById("post-edit-title");
let pProfile = document.getElementById("p-profile");
let commentSpace = document.querySelector(".space");
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;
function togggelLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.display = "flex";
  } else {
    document.getElementById("loader").style.display = "none";
  }
}
// scroll pagination

window.addEventListener("scroll", () => {
  const endPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if (endPage && currentPage < lastPage) {
    currentPage += 1;
    getPosts(false, currentPage);
  }
});
function clickedPost(id) {
  window.location = `postDetails.html?postId=${id}`;
}
const urlParama = new URLSearchParams(window.location.search);
let idd = urlParama.get("postId");
function showTheClickedPost() {
  axios
    .get(`${baseUrl}/posts/${idd}`)
    .then(function (response) {
      let post = response.data.data;
      let cardpostPage = document.getElementById("card-post");
      let userName = document.getElementById("userN");
      let comments = post.comments;

      let postTitle = "";
      if (post.title != null) {
        postTitle = post.title;
      }
      userName.innerHTML = `<span >
    ${post.author.username} 
  </span>post`;
      cardpostPage.innerHTML = `<div class="card-header mt-2 mb-2">
  <img src=${post.author.profile_image} onclick="userprof(${post.author.id})" class="rounded-circle border border-2" alt="">
    <span class="user ms-2" onclick="userprof(${post.author.id})"><b>${post.author.username}</b></span>
</div>
<div class="card-body">
  <img src=${post.image} class=" w-100 " style="max-height:70vh;">
  <h6 style="color: rgb(144, 139, 139);margin-top: 16px;">${post.created_at}</h6>
  <h5>${postTitle}</h5>
  <p style="border-bottom:1px solid #d3d1d1 ;" class="pb-4">${post.body}</p>
  <div >
  <div class="mb-4">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
      viewBox="0 0 16 16">
      <path
        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
    </svg><span style="margin-left: 8px;" class="mb-3">(${post.comments_count})</span> comment <span id="post-tags-${post.id}" ></span>
  </div>
    <div id="comments">
  
</div>
    </div> 
</div>
</div>`;
      document.getElementById("comments").innerHTML = "";

      comments.map((comment) => {
        document.getElementById(
          "comments"
        ).innerHTML += `<div class="p-3 mt-1 bg-light w-100"> <span class="card-header"><img src=${comment.author.profile_image} class="rounded-circle border border-2" alt=""></span>
  <span class="ms-1"><b>${comment.author.username}</b></span><div class="mt-2">${comment.body}</div></div>`;
      });
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
}
function profileClicked() {
  const user = getUserData();
  userprof(user.id);
}
// add comment
// showTheClickedPost()

function sendComment() {
  let token = localStorage.getItem("token");
  let postComment = document.getElementById("add-comment").value;
  const params = {
    body: postComment,
  };
  const headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .post(`${baseUrl}/posts/${idd}/comments`, params, {
      headers: headers,
    })
    .then((response) => {
      let addedCommen = response.data.data.body;
      document.getElementById(
        "comments"
      ).innerHTML += `<div class="p-3 mt-1 bg-light w-100"> <span class="card-header"><img src=${response.data.data.author.profile_image} class="rounded-circle border border-2" alt=""></span>
  <span class="ms-1"><b>${response.data.data.author.username}</b></span><div class="mt-2">${addedCommen}</div></div>`;
    })
    .catch(() => {
      showAlert("you need to log in", "danger");
    });
}
// add comment

// scroll pagination
function getPosts(reload = true, page = 1) {
  togggelLoader(true)

  axios.get(`${baseUrl}/posts?limit=4&page=${page}`).then(function (response) {
    // handle success
    togggelLoader(false)

    let posts = response.data.data;
    lastPage = response.data.meta.last_page;
    if (reload) {
      if (cards != null) {
        cards.innerHTML = "";
      }
    }
    posts.map((post) => {
      let postTitle = "";
      let user = getUserData();
      let isUserPost = user != null && post.author.id == user.id;

      let editBut = ``;
      let deletBtn = ``;
      // editBut.innerHTML=''
      if (isUserPost) {
        editBut = `<button class="btn btn-secondary pt-2" onclick="editPostClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">edit</button>`;
        deletBtn = `<button class="btn btn-danger me-2" onclick="deletPostClicked(${post.id})" >Delete</button>`;
      }

      if (post.title != null) {
        postTitle = post.title;
      }
      if (cards != null) {
        cards.innerHTML += `<div class="card shadow" >  <div class="card-header d-flex align-items-center justify-content-between" >
      <span onclick="userprof(${post.author.id})" style="cursor:pointer;" >
      <img src=${post.author.profile_image} class="rounded-circle border border-2" alt="">
      <span class="user ms-2"><b>${post.author.username}</b></span>

      </span>
      <span>
      ${editBut} 
      ${deletBtn}
    </span>
            
        
      </div>
      <div class="card-body" onclick="clickedPost(${post.id})" style="cursor:pointer;" id="c-body">
        <img src=${post.image} class=" w-100 " style="max-height:70vh;">
        <h6 style="color: rgb(144, 139, 139);margin-top: 16px;">${post.created_at}</h6>
        <h5>${postTitle}</h5>
        <p style="border-bottom:1px solid #d3d1d1 ;" class="pb-4">${post.body}</p>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
            viewBox="0 0 16 16">
            <path
              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
          </svg><span style="margin-left: 8px;">(${post.comments_count})</span> comment <span id="post-tags-${post.id}" ></span>  </div> 
      </div>
      </div>
      `;

        document.getElementById(`post-tags-${post.id}`).innerHTML = "";

        post.tags.map((tag) => {
          let content = `<span class="btn btn-secondary rounded-pill ms-2">${tag.name}
        </span>`;
          document.getElementById(`post-tags-${post.id}`).innerHTML += content;
        });
      }
    });
  });
}

function editPostClicked(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  posTitle.innerHTML = "Edit post";
  document.getElementById("createButton").innerHTML = "Update";
  document.getElementById("title").value = post.title;
  document.getElementById("descripe").value = post.body;
  document.getElementById("posst-id").value = post.id;
  //  document.getElementById("post-image").files[0] = [post.image]
  let postEditModel = new bootstrap.Modal(
    document.getElementById("create-post-model")
  );
  postEditModel.toggle();
}

// const urlParamaU = new URLSearchParams(window.location.search);
// let userIdd = urlParama.get("userid");
function userprof(userId) {
  window.location = `profile.html?userid=${userId}`;
}

function addButClick() {
  const posTitle = document.getElementById("post-edit-title");
  posTitle.innerHTML = "Create A New Post";
  document.getElementById("createButton").innerHTML = "Create";
  document.getElementById("title").value = "";
  document.getElementById("descripe").value = "";
  document.getElementById("posst-id").value = "";
  let postEditModel = new bootstrap.Modal(
    document.getElementById("create-post-model")
  );
  postEditModel.toggle();
}
// delet function
function deletPostClicked(id) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`${baseUrl}/posts/${id}`, {
          headers: headers,
        })
        .then((response) => {
          getPosts(true, currentPage);
        });
    }
  });
}
// delet function
getPosts(true, currentPage);
loginbut.addEventListener("click", () => {
  const inputName = document.getElementById("input-name").value;
  const inputPassword = document.getElementById("password-value").value;
  let params = {
    username: inputName,
    password: inputPassword,
  };
  let url = `${baseUrl}/login`;
  togggelLoader(true)
  axios
    .post(url, params)
    .then((response) => {
      togggelLoader(false)

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const model = document.getElementById("exampleModal");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      showAlert("welcome back", "success");

      setupUi();
    })
    .catch(function (error) {
      const model = document.getElementById("exampleModal");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      showAlert(error.response.data.message, "danger");
    })
    .finally(()=>{
      togggelLoader(false)

    })
});
setupUi();
function setupUi() {
  let token = localStorage.getItem("token");
  const liggInBtn = document.getElementById("log-in");
  const registerBtn = document.getElementById("register");
  if (token == null) {
    if (accessPlus != null) {
      accessPlus.style.display = "none";
    }
    logoutBtn.style.display = "none";
    liggInBtn.style.display = "flex";
    registerBtn.style.display = "flex";
  } else {
    if (accessPlus != null) {
      accessPlus.style.display = "flex";
    }
    liggInBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "flex";

    const user = getUserData();
    pProfile.innerHTML = "";
    pProfile.innerHTML += `<img src=${user.profile_image} class="rounded-circle border border-2 me-1"
    style="width: 50px; height: 50px;" alt=""> <span class="me-3">${user.username}</span>`;
  }
}

function getUserData() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
});
signUpBut.addEventListener("click", () => {
  const inputName2 = document.getElementById("input-name2").value;
  const inputUserName = document.getElementById("input-username").value;
  const image = document.getElementById("user-image").files[0];
  const Password = document.getElementById("input-password").value;
  let url2 = `${baseUrl}/register`;
  const formData1 = new FormData();
  formData1.append("name", inputName2);
  formData1.append("username", inputUserName);
  formData1.append("password", Password);
  formData1.append("image", image);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  togggelLoader(true)

  axios
    .post(url2, formData1, {
      headers: headers,
    })
    .then((response) => {
      togggelLoader(false)

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const model = document.getElementById("sign-up-model");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      showAlert("welcome as a new user", "success");

      setupUi();
    })
    .catch(function (error) {
      const model = document.getElementById("sign-up-model");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      showAlert(error.response.data.message, "danger");
    }).finally(()=>{
      togggelLoader(false)

    })
});

function createANewPost() {
  let postId = document.getElementById("posst-id").value;
  let isCreate = postId == null || postId == "";

  let title = document.getElementById("title").value;
  let bodyText = document.getElementById("descripe").value;
  let postImage = document.getElementById("post-image").files[0];
  let url2 = `${baseUrl}/posts`;
  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", bodyText);
  formData.append("image", postImage);

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  if (isCreate) {
    url2 = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url2 = `${baseUrl}/posts/${postId}`;
  }
  togggelLoader(true)
  axios
    .post(url2, formData, {
      headers: headers,
    })
    .then((response) => {
      togggelLoader(false)
      const model = document.getElementById("create-post-model");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      getPosts(true, currentPage);

      showAlert("your post added", "success");
    })
    .catch(function (error) {
      console.log(error);
      showAlert(error.response.data.error_message, "danger");
    });
}
function showAlert(message, color) {
  const alertContainer = document.getElementById("alertContainer");

  const alertElement = document.createElement("div");
  alertElement.classList.add(
    "alert",
    `alert-${color}`,
    "alert-dismissible",
    "fade",
    "show"
  );

  alertElement.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.classList.add("btn-close");
  closeButton.setAttribute("type", "button");
  closeButton.setAttribute("data-bs-dismiss", "alert");
  closeButton.setAttribute("aria-label", "Close");

  alertElement.appendChild(closeButton);

  alertContainer.appendChild(alertElement);
}
