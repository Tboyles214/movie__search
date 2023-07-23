const apikey = '42a9be14';
const apiurl = 'http://www.omdbapi.com/?apikey=';

const urlWithKey = apiurl + apikey;

async function searchOMDBConnection(searchInput) {
  try {
    const response = await fetch(`${urlWithKey}&t=${encodeURIComponent(searchInput)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching for the movie:', error.message);
    return null;
  }
}

function displayMovieData(movieData) {
  if (movieData) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = `
      <h2>${movieData.Title}</h2>
      <img src="${movieData.Poster}" alt="${movieData.Title}">
      <p>${movieData.Rated}</p>`;
  } else {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = 'Movie not found.';
  }
}

async function searchMovie() {
  const searchInput = document.getElementById('searchInput').value;
  const movieData = await searchOMDBConnection(searchInput);
  console.log(movieData); // Display the data in the console
  displayMovieData(movieData);
}
