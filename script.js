let songs = [];
let currentAudio = null;
let currentIndex = -1; // Index of the currently playing song
const crossfadeDuration = 2000; // Crossfade duration in milliseconds
const fadeInterval = 50; // Interval for volume adjustment

// Fetch songs from songs.json
fetch('songs.json')
  .then(response => response.json())
  .then(data => {
    songs = data;
    displaySongs(songs);
  })
  .catch(error => console.error('Error loading songs:', error));

// Display songs in the HTML
function displaySongs(filteredsongs) {
  const container = document.getElementById('songs-container');
  container.innerHTML = ''; // Clear previous content

  filteredsongs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.className = 'song-item';

    const title = document.createElement('span');
    title.textContent = song.title;

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.addEventListener('click', () => playSong(index));

    songItem.appendChild(title);
    songItem.appendChild(playButton);
    container.appendChild(songItem);
  });
}

// Play a song with crossfade
function playSong(index) {
  if (currentAudio) {
    fadeOut(currentAudio, crossfadeDuration);
  }

  const nextSong = songs[index];
  const nextAudio = new Audio(nextSong.file);
  nextAudio.volume = 0; // Start muted

  nextAudio.play()
    .then(() => {
      fadeIn(nextAudio, crossfadeDuration);
      currentAudio = nextAudio;
      currentIndex = index;

      // Automatically crossfade to the next song when this one ends
      currentAudio.addEventListener('ended', () => {
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(nextIndex);
      });
    })
    .catch(error => console.error('Error playing song:', error));
}

// Fade out the current audio
function fadeOut(audio, duration) {
  const step = audio.volume / (duration / fadeInterval);
  const fadeOutInterval = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(0, audio.volume - step);
    } else {
      clearInterval(fadeOutInterval);
      audio.pause();
    }
  }, fadeInterval);
}

// Fade in the new audio
function fadeIn(audio, duration) {
  const step = 1 / (duration / fadeInterval);
  const fadeInInterval = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(1, audio.volume + step);
    } else {
      clearInterval(fadeInInterval);
    }
  }, fadeInterval);
}

const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener('click', searchSongs);

function searchSongs() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const filteredsongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchInput)
  );
  displaySongs(filteredsongs);
}

const themeSelector = document.getElementById('theme-selector');

themeSelector.addEventListener('change', (event) => {
  const selectedTheme = event.target.value;

  // Remove all theme classes
  document.body.classList.remove('theme-green-hill', 'theme-chemical-plant', 'theme-sky-sanctuary');

  // Apply the selected theme
  switch (selectedTheme) {
    case 'green-hill':
      document.body.classList.add('theme-green-hill');
      break;
    case 'chemical-plant':
      document.body.classList.add('theme-chemical-plant');
      console.log('Chemical Plant theme applied');
      break;
    case 'sky-sanctuary':
      document.body.classList.add('theme-sky-sanctuary');
      break;
    case 'default':
    default:
      // No additional classes; this falls back to the default styling
      break;
  }

  console.log('Current body classes:', document.body.className);
});