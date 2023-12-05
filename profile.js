const urlParamaU = new URLSearchParams(window.location.search);
let userIdd = urlParama.get("userid");
setupUi();

const cardInfo = document.getElementById("card-info");
let myCardPost = document.getElementById("my-posts");
console.log(cardInfo);
function getUserProfile() {

  // const user = getUserData();
  // console.log(user);
  axios.get(`${baseUrl}/users/${userIdd}`).then(function (response) {
    let user = response.data.data;
  let email = "";
  if (user.email != null) email = user.email;
  else {
    email = "";
  }

  cardInfo.innerHTML = `<div class=" d-flex  flex-nowrap align-items-center justify-content-around flex-column flex-md-row flex-lg-row ">
    <div  style="display: flex; justify-content:space-between;align-items: center;"
    class="imgProfile ps-lg-4 ps-0 mb-3 ">
      <img src=${user.profile_image} class="border border-info rounded-circle me-5" style="width: 120px;height: 120px;"
        alt="">
        <div class=" detials "
      style="display: flex; flex-direction: column;justify-content:space-around;align-items: center;">
      <div id="authormail" style="color: #929191;">
      ${email}
      </div>
      <div id="authorusername" class="fs-3" style="color:#34b5f8d1;">
      ${user.username}

      </div>
      <div id="authorname" class="fs-4"style="color: #929191;" >
      ${user.name}

      </div>
    </div>
    
    </div>
    <div class=" counter mb-3">
      <div id="number" class="fs-3" style="color: #5d5b5b;">Posts : <span style="color: #929191;">${user.posts_count}</span></div>
      <div id="counter" class="fs-3"  style="color: #5d5b5b;" >Comments : <span style="color: #929191;">  ${user.comments_count}</span></div>

    </div>
  </div>`;
})
}
getUserProfile();


function getMyPosts() {
  // const user = getUserData();
  // let id = user.id;
  togggelLoader(true)

  axios.get(`${baseUrl}/users/${userIdd}/posts`).then((response) => {
    togggelLoader(false)

    let posts = response.data.data;

    posts.map((post) => {
      let postTitle = "";
      let user = getUserData();
      let isUserPost = user != null && post.author.id == user.id;

      let editBut = ``;
      let deletBtn = ``;
      // editBut.innerHTML=''
      if (isUserPost) {
        editBut = `<button class="btn btn-secondary" onclick="editPostClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')" >edit</button>`;
        deletBtn = `<button class="btn btn-danger me-2" onclick="deletPostClicked(${post.id})" >Delete</button>`;
      }

      if (post.title != null) {
        postTitle = post.title;
      }
      if (myCardPost != null) {
        myCardPost.innerHTML += `<div class="card shadow" >  <div class="card-header d-flex align-items-center justify-content-between" >
          <span  onclick="clickedPost(${post.id})">        <img src=${post.author.profile_image} class="rounded-circle border border-2" alt="">
          <span class="user ms-2"><b>${post.author.username}</b></span>
          </span>
          <span>
        ${editBut} 
        ${deletBtn}      
          </span>
        
      </div>
      <div class="card-body"onclick="clickedPost(${post.id})"  style="cursor:pointer;" id="c-body">
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
  // location.reload();
}

getMyPosts();
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
    }).then((response) => {
      window.location.reload();
      Swal.fire({
  title: "Deleted!",
  text: "Your file has been deleted.",
  icon: "success",
});
    })
    }
  })
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
  axios
    .post(url2, formData, {
      headers: headers,
    })
    .then((response) => {
      const model = document.getElementById("create-post-model");
      const modelInstance = bootstrap.Modal.getInstance(model);
      modelInstance.hide();
      window.location.reload();
      showAlert("your post added", "success");
    })
    .catch(function (error) {
      console.log(error);
      showAlert(error.response.data.error_message, "danger");
    });
}
