// Fetch and display tracks from songs.json
async function loadSongs() {
  try {
    const response = await fetch('songs.json'); // Ensure this path is correct
    const songs = await response.json();

    const songContainer = document.getElementById('songContainer');
    songContainer.innerHTML = ''; // Clear the container

    // Add Search Bar and Buttons
    addSearchBar(songs);

    // Display Songs
    displaySongs(songs, songContainer);
  } catch (error) {
    console.error('Error loading songs:', error);
  }
}

// Function to display songs
function displaySongs(songs, container) {
  container.innerHTML = ''; // Clear container
  songs.forEach((song) => {
    // Create a container for each song
    const songDiv = document.createElement('div');
    songDiv.classList.add('song-item');

    // Add thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.src = song.thumbnail;
    thumbnail.alt = `${song.title} thumbnail`;
    thumbnail.classList.add('song-thumbnail');

    // Add title and artist
    const title = document.createElement('h3');
    title.textContent = song.title;

    const artist = document.createElement('p');
    artist.textContent = song.artist;

    // Add audio element
    const audio = document.createElement('audio');
    audio.src = song.url;

    // Add play/pause button
    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.classList.add('play-button');

    playButton.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playButton.textContent = 'Pause';
      } else {
        audio.pause();
        playButton.textContent = 'Play';
      }
    });

    // Append elements to songDiv
    songDiv.appendChild(thumbnail);
    songDiv.appendChild(title);
    songDiv.appendChild(artist);
    songDiv.appendChild(playButton);

    // Append audio element (optional for debugging)
    songDiv.appendChild(audio);

    // Append to the main container
    container.appendChild(songDiv);
  });
}

// Function to add search bar and buttons
function addSearchBar(songs) {
  const searchContainer = document.getElementById('searchContainer');
  searchContainer.innerHTML = ''; // Clear search container

  // Create search bar
  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.placeholder = 'Search songs...';
  searchBar.id = 'searchBar';

  // Create search button
  const searchButton = document.createElement('button');
  searchButton.textContent = 'Search';
  searchButton.id = 'searchButton';

  // Create clear button
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear';
  clearButton.id = 'clearButton';

  // Add event listeners
  searchButton.addEventListener('click', () => {
    const query = searchBar.value.toLowerCase();
    const filteredSongs = songs.filter((song) =>
      song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
    );
    displaySongs(filteredSongs, document.getElementById('songContainer'));
  });

  clearButton.addEventListener('click', () => {
    searchBar.value = '';
    displaySongs(songs, document.getElementById('songContainer'));
  });

  // Append search bar and buttons to the container
  searchContainer.appendChild(searchBar);
  searchContainer.appendChild(searchButton);
  searchContainer.appendChild(clearButton);
}

// Load songs on page load
document.addEventListener('DOMContentLoaded', loadSongs);

document.getElementById('theme').addEventListener('change', (event) => {
  const selectedTheme = event.target.value;
  document.body.className = ''; // Clear all existing theme classes
  switch (selectedTheme) {
    case 'greenHill':
      document.body.classList.add('greenHill-theme');
      break;
    case 'chemicalPlant':
      document.body.classList.add('chemicalPlant-theme');
      break;
    case 'skySanctuary':
      document.body.classList.add('skySanctuary-theme');
      break;
    default:
      document.body.classList.add('default-theme');
  }
});
