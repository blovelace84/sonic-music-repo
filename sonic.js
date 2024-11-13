document.addEventListener("DOMContentLoaded", () => {
    const musicListContainer = document.getElementById("music-list");
    const audioPlayer = document.getElementById("audio-player");
  
    // Fetch songs from JSON file
    fetch('songs.json')
      .then(response => response.json())
      .then(musicList => {
        musicList.forEach(song => {
          const songItem = document.createElement("div");
          songItem.classList.add("music-item");
          songItem.setAttribute("data-audio", song.file);
  
          const songTitle = document.createElement("span");
          songTitle.textContent = song.title;
  
          const playButton = document.createElement("button");
          playButton.textContent = "Play";
  
          playButton.addEventListener("click", () => {
            audioPlayer.src = song.file;
            audioPlayer.play();
          });
  
          songItem.appendChild(songTitle);
          songItem.appendChild(playButton);
          musicListContainer.appendChild(songItem);
        });
      })
      .catch(error => console.error("Error loading songs:", error));
  });