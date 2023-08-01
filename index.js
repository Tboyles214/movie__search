// display 6 results from search
// display title, poster,year
// display no movies found if no results
// add loading state

const apikey = '42a9be14';
const apiurl = 'https://www.omdbapi.com/?apikey=';
const urlWithKey = apiurl + apikey;
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const trendingMovies =['tt1517268', 'tt15398776', 'tt0439572', 'tt6791350', 'tt1695843', 'tt4912910']
let savedSearchInput = '';

searchButton.addEventListener('click', function() {
  const searchInputValue = searchInput.value.trim();
  savedSearchInput = searchInputValue;
  searchMovie();});
  console.log(savedSearchInput)
  
  
searchInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchButton.click();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
      // Fetch and display trending movies
      const trendingMovieData = await Promise.all(trendingMovies.map(async movieId => {
          const movieData = await fetchMovieById(movieId);
          return movieData;
      }));
      displayMovieData(trendingMovieData);
  } catch (error) {
      console.error('Error fetching trending movie data:', error.message);
  }
});

async function fetchMovieById(movieId) {
  try {
    const response = await fetch(`${urlWithKey}&i=${movieId}&plot=short`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie by ID:', error.message);
    return null;
  }
}

async function searchOMDBConnection(searchInputValue) {
  try {
    const response = await fetch(`${urlWithKey}&s=${encodeURIComponent(searchInputValue)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    console.log('API Response:', data);

    const searchResults = data.Search || [];
    console.log('Search Results:', searchResults);

    const movieIDs = searchResults.map(movie => movie.imdbID);
    console.log('Movie IDs:', movieIDs);

    
    const detailedMovieData = await Promise.all(
      movieIDs.map(async id => {
        const detailedResponse = await fetch(`${urlWithKey}&i=${id}&plot=short`);
        const detailedData = await detailedResponse.json();
        return detailedData;
      })
    );

    console.log('Detailed Movie Data:', detailedMovieData);
    return detailedMovieData.slice(0, 6);
  } catch (error) {
    console.error('Error searching for the movie:', error.message);
    return [];
  }
}



function displayMovieData(movieData) {

  
  if (movieData.length === 0) {
    searchResults.innerHTML = 'No movies found.';
  } else {
    searchResults.innerHTML = `
      <h2 id="search" class="search__display"> Search Results for: ${savedSearchInput}</h2>
      <div class="movie__container">
      ${movieData
        .map(
          movie => `
            <div class="movie__card">
              <div class = "movie__info">
              <a target="_blank" href='https://www.imdb.com/title/${movie.imdbID}'>
                <img class="movie__image" src="${movie.Poster}" alt="${movie.Title}">
              </a>
              <h2 class="movie__title">${movie.Title}</h2>
              </div>
            </div>
          `
        )
        .join('')}
    </div>`;

    

    const movieCards = searchResults.querySelectorAll('.movie__card');
    movieCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        showMoviePopup(movieData[index]);
      });
    });
  }
}




    
  
  



// function showMoviePopup(movie) {
//   // Get the modal element and the elements inside it
//   const modal = document.getElementById('movieModal');
//   const modalTitle = modal.querySelector('.modal__title');
//   const modalYear = modal.querySelector('.modal__year');
//   const modalDirector = modal.querySelector('.modal__director');
//   const modalPlot = modal.querySelector('.modal__plot');
//   const modalActor = modal.querySelector('.modal__actor');
//   const modalRating = modal.querySelector('.modal__rating');
//   const modalImdb = modal.querySelector('.modal__imdb'); 

//   // Populate the modal with the movie details
//   modalTitle.innerHTML = `<h2>${movie.Title}</h2>`;
//   modalYear.innerHTML = `<p>Year: ${movie.Year}</p>`;
//   modalDirector.innerHTML = `<p>Director: ${movie.Director}</p>`;
//   modalPlot.innerHTML = `<p>Plot: ${movie.Plot}</p>`;
//   modalActor.innerHTML = `<p>Cast: ${movie.Actors}</p>`;
//   modalRating.innerHTML = `<p>Rating: ${movie.imdbRating}/10</p>`;
//   modalImdb.innerHTML = `<a target="_blank" href='https://www.imdb.com/title/${movie.imdbID}'>Click to Learn Move</a>`; 

//   // Display the modal
//   modal.style.display = 'block';
// }





  function closeMovieModal() {
  const modal = document.getElementById('movieModal');
  modal.style.display = 'none';
}


async function searchMovie() {
  const searchInputValue = searchInput.value.trim();
  if (searchInputValue === '') {
    return;
  }

  try {
    const loadingOverlay = document.getElementById('loading');
    
    
    loadingOverlay.style.display = 'flex';
    await new Promise(resolve => setTimeout(resolve, 2000));

    const movieData = await searchOMDBConnection(searchInputValue);
    loadingOverlay.style.display = 'none';
    displayMovieData(movieData);
    
    const searchResults = document.getElementById('search');
    searchResults.classList.add('search__display__visible')
    const trendingMovies = document.getElementById('trending');
    trendingMovies.classList.add('trending__display__hidden')


  } catch (error) {
    console.error('Error searching for the movie:', error.message);
  }
}


  


