function showMovieTrailer() {
  const movieId = 315162;
  const API_KEY = "0d3f8ddb7e49ab4028b125d556a874b9";
  const BASE_URL = "https://api.themoviedb.org/3";
  const DETAILS_URL = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`;

  fetch(DETAILS_URL)
    .then(res => res.json())
    .then(data => {
      const videoKey = data.videos.results[0].key;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoKey}`;
      iframe.width = 560;
      iframe.height = 315;
      document.body.appendChild(iframe);
    })
    .catch(error => console.error(error));
}

showMovieTrailer();
