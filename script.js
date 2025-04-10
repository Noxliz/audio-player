document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const audioPlayer = document.querySelector('.audio-player');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const playIcon = document.querySelector('.play-icon');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const repeatBtn = document.querySelector('.repeat-btn');
    const volumeBtn = document.querySelector('.volume-icon');
    const volumeSlider = document.querySelector('.volume-bar');
    const volumeProgress = document.querySelector('.volume-progress');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.querySelector('.current-time');
    const maxDurationEl = document.querySelector('.max-duration');
    const playlistBtn = document.querySelector('.playlist-btn');
    const playlist = document.querySelector('.playlist');
    const closePlaylistBtn = document.querySelector('.close-playlist');
    const playlistSongs = document.querySelector('.playlist-songs');
    const waveBars = document.querySelectorAll('.wave-bar');
    
    // Création de l'élément audio
    const audio = new Audio();
    
    // Variables d'état
    let isPlaying = false;
    let currentSongIndex = 0;
    let isRepeat = false;
    let updateTimer;
    
    // Liste des chansons
    const songs = [
        {
            title: 'Chanson 1',
            artist: 'Artiste 1',
            src: 'assets/songs/song1.mp3'
        },
        {
            title: 'Chanson 2',
            artist: 'Artiste 2',
            src: 'assets/songs/song2.mp3'
        },
        {
            title: 'Chanson 3',
            artist: 'Artiste 3',
            src: 'assets/songs/song3.mp3'
        }
    ];
    
    // Initialisation
    function init() {
        loadSong(currentSongIndex);
        renderPlaylist();
        audio.volume = 0.8; // Volume par défaut à 80%
        updateVolumeUI();
    }
    
    // Charger une chanson
    function loadSong(index) {
        clearInterval(updateTimer);
        resetMusicStatus();
        
        audio.src = songs[index].src;
        songTitle.textContent = songs[index].title;
        songArtist.textContent = songs[index].artist;
        
        audio.load();
        updateTimer = setInterval(updateProgress, 1000);
        
        highlightPlayingSong();
    }
    
    // Mettre à jour la barre de progression
    function updateProgress() {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = progressPercent + '%';
            
            // Mise à jour du temps écoulé
            let currentMin = Math.floor(audio.currentTime / 60);
            let currentSec = Math.floor(audio.currentTime % 60);
            currentMin = currentMin < 10 ? '0' + currentMin : currentMin;
            currentSec = currentSec < 10 ? '0' + currentSec : currentSec;
            currentTimeEl.textContent = `${currentMin}:${currentSec}`;
            
            // Mise à jour du temps total si disponible
            if (audio.duration !== Infinity) {
                let totalMin = Math.floor(audio.duration / 60);
                let totalSec = Math.floor(audio.duration % 60);
                totalMin = totalMin < 10 ? '0' + totalMin : totalMin;
                totalSec = totalSec < 10 ? '0' + totalSec : totalSec;
                maxDurationEl.textContent = `${totalMin}:${totalSec}`;
            }
        }
    }
    
    // Réinitialiser l'état du lecteur
    function resetMusicStatus() {
        currentTimeEl.textContent = '00:00';
        maxDurationEl.textContent = '00:00';
        progress.style.width = '0%';
    }
    
    // Animer les barres de visualisation
    function animateWaveBars(play) {
        waveBars.forEach(bar => {
            // Pause ou reprise de l'animation
            if (play) {
                bar.style.animationPlayState = 'running';
            } else {
                bar.style.animationPlayState = 'paused';
            }
        });
    }
    
    // Mettre en surbrillance la chanson en cours
    function highlightPlayingSong() {
        const playlistItems = document.querySelectorAll('.playlist-song');
        playlistItems.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }
    
    // Jouer ou mettre en pause
    function playPause() {
        if (isPlaying) {
            // Pause
            audio.pause();
            playIcon.textContent = 'play_circle';
            animateWaveBars(false);
            isPlaying = false;
        } else {
            // Play
            audio.play();
            playIcon.textContent = 'pause_circle';
            animateWaveBars(true);
            isPlaying = true;
        }
    }
    
    // Chanson précédente
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audio.play();
            animateWaveBars(true);
        }
    }
    
    // Chanson suivante
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audio.play();
            animateWaveBars(true);
        }
    }
    
    // Mise à jour de l'UI du volume
    function updateVolumeUI() {
        const volumePercent = audio.volume * 100;
        volumeProgress.style.width = volumePercent + '%';
        
        // Mise à jour de l'icône du volume
        if (audio.volume === 0) {
            volumeBtn.textContent = 'volume_off';
        } else if (audio.volume < 0.5) {
            volumeBtn.textContent = 'volume_down';
        } else {
            volumeBtn.textContent = 'volume_up';
        }
    }
    
    // Créer la playlist à partir des chansons
    function renderPlaylist() {
        playlistSongs.innerHTML = '';
        
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.classList.add('playlist-song');
            if (index === currentSongIndex) {
                li.classList.add('playing');
            }
            
            li.innerHTML = `
                <div class="song-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <span class="song-duration">03:00</span>
            `;
            
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playlist.classList.remove('show');
                if (isPlaying) {
                    audio.play();
                    animateWaveBars(true);
                } else {
                    playPause();
                }
            });
            
            playlistSongs.appendChild(li);
        });
    }
    
    // Event listeners
    playPauseBtn.addEventListener('click', playPause);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    
    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        audio.loop = isRepeat;
        repeatBtn.classList.toggle('active');
    });
    
    volumeBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
            // Store the volume before muting
            audio.dataset.prevVolume = audio.volume;
            audio.volume = 0;
        } else {
            // Restore the volume
            audio.volume = audio.dataset.prevVolume || 0.8;
        }
        updateVolumeUI();
    });
    
    volumeSlider.addEventListener('click', (e) => {
        const sliderWidth = volumeSlider.clientWidth;
        const clickPosition = e.offsetX;
        const volumePercent = clickPosition / sliderWidth;
        
        audio.volume = volumePercent;
        updateVolumeUI();
    });
    
    progressBar.addEventListener('click', (e) => {
        const progressWidth = progressBar.clientWidth;
        const clickPosition = e.offsetX;
        const seekTime = (clickPosition / progressWidth) * audio.duration;
        
        audio.currentTime = seekTime;
    });
    
    playlistBtn.addEventListener('click', () => {
        playlist.classList.add('show');
    });
    
    closePlaylistBtn.addEventListener('click', () => {
        playlist.classList.remove('show');
    });
    
    audio.addEventListener('ended', () => {
        if (!isRepeat) {
            nextSong();
        }
    });
    
    audio.addEventListener('loadedmetadata', () => {
        // Mettre à jour la durée totale quand la métadonnée est chargée
        if (audio.duration !== Infinity) {
            let totalMin = Math.floor(audio.duration / 60);
            let totalSec = Math.floor(audio.duration % 60);
            totalMin = totalMin < 10 ? '0' + totalMin : totalMin;
            totalSec = totalSec < 10 ? '0' + totalSec : totalSec;
            maxDurationEl.textContent = `${totalMin}:${totalSec}`;
            
            // Mettre à jour les durées dans la playlist
            const duration = `${totalMin}:${totalSec}`;
            const currentPlaylistItem = document.querySelectorAll('.playlist-song')[currentSongIndex];
            if (currentPlaylistItem) {
                currentPlaylistItem.querySelector('.song-duration').textContent = duration;
            }
        }
    });
    
    // Initialiser le lecteur audio
    init();
});
