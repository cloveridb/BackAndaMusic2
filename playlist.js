// playlist.js
// Module untuk manage playlist data

const fs = require('fs');
const path = require('path');

const PLAYLIST_FILE = path.join(__dirname, 'data', 'playlist.json');

// Default playlist jika file belum ada
const defaultPlaylist = [
  {
    name: "Summer Vibes",
    id: 1234567890,
    artist: "DJ Example",
    duration: 180,
    imageId: 6031097225  // rbxassetid://6031097225
  },
  {
    name: "Night Club Mix",
    id: 9876543210,
    artist: "Producer X",
    duration: 240,
    imageId: 6031097225
  },
  {
    name: "Chill House",
    id: 5555555555,
    artist: "Beat Maker",
    duration: 200,
    imageId: 6031097225
  },
  {
    name: "Deep Bass",
    id: 7777777777,
    artist: "Bass Lord",
    duration: 220,
    imageId: 6031097225
  }
];

// Buat folder data jika belum ada
function ensureDataFolder() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load playlist dari file
function loadPlaylist() {
  try {
    ensureDataFolder();
    
    if (fs.existsSync(PLAYLIST_FILE)) {
      const data = fs.readFileSync(PLAYLIST_FILE, 'utf8');
      return JSON.parse(data);
    } else {
      // File belum ada, buat dengan default playlist
      savePlaylist(defaultPlaylist);
      return defaultPlaylist;
    }
  } catch (error) {
    console.error('❌ Error loading playlist:', error.message);
    return defaultPlaylist;
  }
}

// Save playlist ke file
function savePlaylist(playlist) {
  try {
    ensureDataFolder();
    fs.writeFileSync(PLAYLIST_FILE, JSON.stringify(playlist, null, 2), 'utf8');
    console.log('💾 Playlist saved to file');
    return true;
  } catch (error) {
    console.error('❌ Error saving playlist:', error.message);
    return false;
  }
}

// Get semua playlist
function getPlaylist() {
  return loadPlaylist();
}

// Add lagu baru
function addSong(songData) {
  const playlist = loadPlaylist();
  const newSong = {
    name: songData.name,
    id: parseInt(songData.id),
    artist: songData.artist || 'Unknown Artist',
    duration: songData.duration || 0,
    imageId: songData.imageId ? parseInt(songData.imageId) : 6031097225,
    requestedBy: songData.requestedBy || 'Unknown'
  };
  
  playlist.push(newSong);
  savePlaylist(playlist);
  
  return {
    success: true,
    song: newSong,
    totalSongs: playlist.length
  };
}

// Delete lagu by index
function deleteSong(index) {
  const playlist = loadPlaylist();
  
  if (index < 0 || index >= playlist.length) {
    return {
      success: false,
      error: 'Index tidak valid'
    };
  }
  
  const deleted = playlist.splice(index, 1)[0];
  savePlaylist(playlist);
  
  return {
    success: true,
    deleted: deleted,
    totalSongs: playlist.length
  };
}

// Update lagu by index
function updateSong(index, songData) {
  const playlist = loadPlaylist();
  
  if (index < 0 || index >= playlist.length) {
    return {
      success: false,
      error: 'Index tidak valid'
    };
  }
  
  if (songData.name) playlist[index].name = songData.name;
  if (songData.id) playlist[index].id = parseInt(songData.id);
  if (songData.artist) playlist[index].artist = songData.artist;
  if (songData.duration) playlist[index].duration = songData.duration;
  if (songData.imageId) playlist[index].imageId = parseInt(songData.imageId);
  
  savePlaylist(playlist);
  
  return {
    success: true,
    song: playlist[index]
  };
}

// Export semua functions
module.exports = {
  getPlaylist,
  addSong,
  deleteSong,
  updateSong,
  loadPlaylist,
  savePlaylist
};
