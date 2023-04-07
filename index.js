let email = document.getElementById("email");
let display = document.getElementById("show");

const myModal = new bootstrap.Modal(document.getElementById("exampleModal"));

function next() {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  if (regexExp.test(email.value)) {
    window.open("show.html", "_self");

    localStorage.setItem("id", email.value);
    localStorage.setItem(email.value, JSON.stringify([]));
  } else if (email.value == "") {
    display.innerHTML = "Input field is empty";
  } else {
    alert("Account Not Registered");

    window.open("error.html", "_self");
  }
}

let movies = [];

console.log(window.location.href);

window.location.href == "http://127.0.0.1:5500/show.html" ||
  "https://show-movies-with-netflix.vercel.app/show.html";

if (window.location.href) {
  load();
}

//https://api.themoviedb.org/3/movie/76600/videos?api_key=f7e65740c28f0e6ddf5f412c8e4df4f8&language=en-US

async function videDetails(id) {
  let output = [];
  output = fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=f7e65740c28f0e6ddf5f412c8e4df4f8&language=en-US`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data.results.filter(
        (item) => item.type == "Trailer" && item.name == "Official Trailer"
      );
    });

  return output;
}

function load() {
  fetch(
    "https://api.themoviedb.org/3/trending/all/day?api_key=f7e65740c28f0e6ddf5f412c8e4df4f8"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      watchmovie(data.results);
    });
}

let moviecontent = document.querySelector(".moviecontent");

function watchmovie(movies) {
  let j = 0;
  for (let i = 0; i < movies.length; i++) {
    let content = document.createElement("div");

    let path = "https://image.tmdb.org/t/p/original";

    if (movies[i].original_title != undefined) {
      let img = movies[i].backdrop_path;
      let date = movies[i].release_date;
      let title = movies[i].original_title;
      let overview = movies[i].overview;
      let mvId = movies[i].id;
      //let other=movies[i].original_name;

      content.innerHTML = `<div class="movie-box">
      <div class="pic">
        <img src="${path}${img}" class="movie-img">
      </div>
      <h2 class="movie-title">${title.substr(0, 18)}</h2>
    <div class="like_contain">  <span class="movie-price">${date} </span>
    <i class="fa-regular fa-heart like" ></i></div>
    
    </div>`;

      moviecontent.append(content);

      let likeMovie = document.querySelectorAll(".like");

      likeMovie[j].addEventListener("click", function (index, j) {
        let userid = localStorage.id;

        let movies = JSON.parse(localStorage.getItem(userid));
        //console.log(movies);

        if (movies.includes(title)) {
          console.log(j);
          let pos = movies.indexOf(title);
          movies.splice(pos, 1);
          localStorage.setItem(userid, JSON.stringify(movies));
          this.classList.remove("fa-solid");
          this.classList.add("fa-regular");
          console.log(this);
        } else {
          this.classList.remove("fa-regular");
          this.classList.add("fa-solid");
          console.log(this);
          movies.push(title);
          localStorage.setItem(userid, JSON.stringify(movies));
        }
      });

      let moveImg = document.querySelectorAll(".movie-img");

      moveImg[j].onclick = async function () {
        await Showdetails(title, img, overview, mvId);
      };

      j++;
    }
  }
}

//show videos in modal box
async function Showdetails(title, img, overview, id) {
  let path = "https://image.tmdb.org/t/p/original";
  let youtube_path = "https://www.youtube.com/embed/";

  let watch = await videDetails(id).then((data) => {
    document.getElementById("image").src = path + img;
    document.getElementById("image").style.display = "none";
    document.getElementById("iframe").src = youtube_path + data[0].key;

    console.log(data);
  });
  document.getElementById("titles").innerHTML = title.substr(0, 18);
  document.getElementById("overview").innerHTML = overview;
  myModal.show();
}

async function seeVideo() {
  let watch = await videDetails(76600).then((data) => console.log(data));
}

var stopVideo = function () {
  var iframe = document.querySelector("iframe");
  var video = document.querySelector("video");
  if (iframe) {
    iframe.src = "";
    //iframe.src = iframeSrc;
  }
  if (video) {
    video.pause();
  }
};
//stop the video from playing
let close = document.querySelector(".btn-close");
close.addEventListener("click", function () {
  document.getElementById("iframe").src = "";
});
