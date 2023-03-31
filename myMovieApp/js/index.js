////Lien fr a rajouter BASE_URL+ComprisdansImg_url/api_key=0d3f8ddb7e49ab4028b125d556a874b9/&language=fr-US&include_image_language=fr,null
//Chargement de L'Api
//Base Url + /find/{external_id}?  +  api_key=0d3f8ddb7e49ab4028b125d556a874b9 + 
//https://api.themoviedb.org/3/search/movie?api_key=0d3f8ddb7e49ab4028b125d556a874b9&language=fr-fr'&query='+

const API_KEY ="api_key=0d3f8ddb7e49ab4028b125d556a874b9";

const BASE_URL ="https://api.themoviedb.org/3";

const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}&language=fr-fr`;

const IMG_URL = "https://image.tmdb.org/t/p/w500/";

const searchURL = `${BASE_URL}/search/movie?${API_KEY}&language=fr-fr`;

//API dans le main
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getMovies(API_URL);

//Fonction pour get les film depuis l'API

function getMovies(url) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const movies = data.results;
        const sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);
        const mostWellRatedMovie = sortedMovies[0];

        // Set the best rated movie poster as the background image
        const imageUrl = `https://image.tmdb.org/t/p/original/${mostWellRatedMovie.poster_path}`;
        bgImage.style.backgroundImage = `url('${imageUrl}')`;

        const movieImages = movies.map(movie => `${IMG_URL}${movie.poster_path}`);
        showMovies(movies, movieImages);
    });
}


//Test ShowMovies
function showMovies(data){
    console.log(data);
    main.innerHTML = '';
    data.forEach(movie => {
        const {title , poster_path,vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.className = "movie" ;
        movieEl.innerHTML = `
        
            <img src="${IMG_URL+poster_path}" alt="${title}">
            

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${Math.floor(vote_average)}
                </span>
            </div>
            <div class="overview">
                <h3>Synopsis</h3>
                ${overview}
            </div>
        `;
        movieEl.addEventListener('click', () => {
            showMovieDetails(id);
        });
        main.appendChild(movieEl);
    })
}

//Modal et detail a afficher
function showMovieDetails(id) {
    const detailsURL = `${BASE_URL}/movie/${id}?${API_KEY}&language=fr-fr&append_to_response=videos`;
    console.log(detailsURL);
    const credit = `${BASE_URL}/movie/${id}/credits?${API_KEY}&language=fr-fr&append_to_response=videos`;
    
    console.log(detailsURL);
    fetch(detailsURL)
        .then(res => res.json())
        .then(data => {
            const { title, tagline, poster_path, vote_average, overview, genres, release_date, runtime, videos, production_companies ,original_title } = data;
            console.log("-------------" + production_companies.map(production_companies => production_companies.name).join(', '));
            fetch(credit)
                .then(res => res.json())
                .then(creditData => {
                    const actors = creditData.cast.slice(0, 5);
                    const actorList = actors.map(actor => `<li><img src="${IMG_URL+actor.profile_path}" alt="${actor.name}">${actor.name}</li>`).join('');

                    const modal = document.createElement('div');
                    modal.className = 'modal';
                    modal.innerHTML = `
                        <div class="modal-content">
                            <span class="close-btn" onclick="closeModal()">&times;</span>
                            <div class="trailerModal">
                            <h2>${title}</h2>
                                ${videos.results.length > 0 ? `<iframe width="950" height="315" src="https://www.youtube.com/embed/${videos.results[0].key}" frameborder="0" allowfullscreen></iframe>` : 'Trailer not available'}
                            </div>
                            <div class="movie-info">
                                <span class="${getColor(vote_average)}">${ Math.round(vote_average)}</span>
                                <h4>${genres.map(genre => genre.name).join(', ')}</h4>
                                <h4>${release_date}</h4>
                                <h4>${runtime} min</h4>
                            </div>
                            <div class="overviewModal">
                                <h3>Synopsis</h3>
                                ${overview}
                            </div>
                            <div class="actor">
                                    <h4>Acteur:</h4>
                                    <ul class="side">
                                    <li>${actorList}</li>
                                    </ul>
                            </div>
                            <div id="Stream">
                                <h4>Stream Ou Achat:</h4>
                                <p id="remove">
                                Il semblerai qu'il n'y ai pas d'option d'achat ou de streaming actuellement
                                </p>
                                </div>
                        </div>
                    `;
                    // Close modal when clicking outside of it
                    window.addEventListener('click', (event) => {
                        if (event.target == modal) {
                            closeModal();
                        }
                    });

                    main.appendChild(modal); // append to main element
                    // function searchMovie() {
                    //     const options = {
                    //         method: 'GET',
                    //         headers: {
                    //             'X-RapidAPI-Key': 'f92b0cac88msh36acb991287ef34p105121jsneca39ab395d2',
                    //             'X-RapidAPI-Host': 'where-can-i-watch1.p.rapidapi.com'
                    //         }
                    //     };
                    
                    //     fetch(`https://where-can-i-watch1.p.rapidapi.com/search/us/${original_title}`, options)
                    //         .then(response => response.json())
                    //         .then(response => {
                    //             const optionsList = document.createElement('ul');
                    //             if ( !isNaN(response[0].options.buy.length) ) {
                    //                 const firstMovie = response[0].options;
                    //                 const buyOptions = firstMovie.buy;
                    //                 console.log(buyOptions);
                    //                 const streamOptions = firstMovie.stream;
                    //                 console.log(streamOptions);
                                    
                    //                 const buyItems = buyOptions.map(buyOption => `<li>${buyOption.provider}: ${buyOption.pricing}</li>`).join('');
                    //                 const streamItems = streamOptions.map(option => `<a href="${option.providerUrl}" target="_blank" rel="noopener noreferrer"><li>${option.provider}</li></a>`).join('');
                                    
                    //                 optionsList.innerHTML = `<li>Buy: <ul>${buyItems}</ul></li><li>Stream: <ul>${streamItems}</ul></li>`;
                    //                 const text = document.getElementById('remove');
                    //                 text.remove()
                    //             } else {
                    //                 optionsList.innerHTML = `<li>Il semblerai qu'il n'y ai pas d'option d'achat ou de streaming actuellement</li>`;
                    //             }
                                
                    //             const stream = document.getElementById("Stream");
                    //             stream.appendChild(optionsList);
                    //         });
                    // }
                    
                    // searchMovie();
                    
                });
        });
}


//Fermer la modal
function closeModal() {
    const modal = document.querySelector('.modal');
    modal.remove();
    document.body.style.overflow = "visible"
}

//Fonction pour changer la couleur de la note
function getColor(vote){
    if(vote >= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

//Fonction de recherche full text

form.addEventListener('submit' , (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm){
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})


// Ajouter un écouteur d'événements 'click' sur chaque élément de film
main.addEventListener('click', (e) => {
    // Vérifier si l'élément cliqué est un élément de film
    if (e.target.closest('.movie')) {
      // Récupérer l'ID du film à partir de l'attribut 'data-movie-id'
    const movieId = e.target.closest('.movie').dataset.movieId;
      // Faire une requête à l'API pour récupérer les détails du film sélectionné
    fetch(`${BASE_URL}/movie/${movieId}?${API_KEY}&language=fr-fr`)
        .then(res => res.json())
        .then(movie => {
          // Afficher les détails du film sélectionné
        const { title, poster_path, overview, credits, recommendations } = movie;
        const movieDetails = document.createElement('div');
        movieDetails.className = 'movie-details';
        movieDetails.innerHTML = `
            <img src="${IMG_URL+poster_path}" alt="${title}">
            <h2>${title}</h2>
            <p>${overview}</p>
            <h3>Acteurs</h3>
            <ul>
            ${credits.cast.map(actor => `<li>${actor.name} (${actor.character})</li>`).join('')}
            </ul>
            <h3>Recommandations</h3>
            <div class="recommendations">
            ${recommendations.results.map(recommendation => `
                <div class="movie">
                <img src="${IMG_URL+recommendation.poster_path}" alt="${recommendation.title}">
                <div class="movie-info">
                    <h3>${recommendation.title}</h3>
                    <span class="${getColor(recommendation.vote_average)}">${recommendation.vote_average}</span>
                </div>
                </div>
            `).join('')}
            </div>
        `;
        main.innerHTML = '';
        main.appendChild(movieDetails);
        document.body.style.overflow =""
        });
    }
});

//Remplir les options des catégories

function Catégories(){
    fetch(`https://api.themoviedb.org/3/genre/movie/list?${API_KEY}&language=fr-fr`)
    .then(response => response.json())
    .then(data => {
        const categorySelect = document.getElementById('Catégories');
        data.genres.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
})
}       
Catégories();

//Mon Select
const select = document.getElementById('Catégories');
select.addEventListener('input', changeCategory);

// Changer les film en fonction des option
function changeCategory() {
    const category = select.value;
  // Merci StackOverflow
    const categoryURL = `${BASE_URL}/discover/movie?${API_KEY}&language=fr-fr&sort_by=popularity.desc&with_genres=${category}`;
  // Et on relance l'affichage
    getMovies(categoryURL);
}

