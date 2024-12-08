document.addEventListener('DOMContentLoaded', () => {
  const songsContainer = document.getElementById('songs-container');
  let currentAudio = null; // Keeps track of the currently playing audio

  // Fetch songs from the JSON file
  fetch('songs.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      return response.json();
    })
    .then(songs => {
      // Clear existing content
      songsContainer.innerHTML = '';

      // Loop through songs and create HTML elements for each
      songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.classList.add('song');

        // Add content to the song element
        songElement.innerHTML = `
          <p><strong>${song.title}</strong> - ${song.artist}</p>
          <button class="play-btn" data-file="${song.file}">Play</button>
          <button class="pause-btn" data-file="${song.file}" disabled>Pause</button>
        `;

        // Append the song element to the container
        songsContainer.appendChild(songElement);
      });

      // Add play functionality to each Play button
      document.querySelectorAll('.play-btn').forEach(button => {
        button.addEventListener('click', () => {
          const audioFile = button.getAttribute('data-file');
          playSong(audioFile, button);
        });
      });

      // Add pause functionality to each Pause button
      document.querySelectorAll('.pause-btn').forEach(button => {
        button.addEventListener('click', () => {
          pauseSong(button);
        });
      });
    })
    .catch(error => {
      console.error('Error loading songs:', error);
      songsContainer.innerHTML = '<p>Failed to load songs. Please try again later.</p>';
    });

  // Function to play a song
  function playSong(file, playButton) {
    // Stop the currently playing audio if it exists
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset playback position
    }

    // Enable the Pause button and disable the Play button
    const pauseButton = playButton.nextElementSibling;
    playButton.disabled = true;
    pauseButton.disabled = false;

    // Create a new audio instance for the selected song
    currentAudio = new Audio(file);
    currentAudio.play();

    // Log an error if the audio can't be played
    currentAudio.addEventListener('error', () => {
      console.error('Error playing song:', file);
    });

    // Re-enable Play button when the song ends
    currentAudio.addEventListener('ended', () => {
      playButton.disabled = false;
      pauseButton.disabled = true;
    });
  }

  // Function to pause the current song
  function pauseSong(pauseButton) {
    if (currentAudio) {
      currentAudio.pause();
    }

    // Re-enable the Play button and disable the Pause button
    const playButton = pauseButton.previousElementSibling;
    playButton.disabled = false;
    pauseButton.disabled = true;
  }
});
