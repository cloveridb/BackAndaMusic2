// playlist.js
// Module untuk manage playlist data dengan auto-fallback

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

// Normalize song data - pastikan semua field ada
function normalizeSong(song) {
  return {
    name: song.name || 'Unknown Song',
    id: parseInt(song.id) || 0,
    artist: song.artist || 'Unknown Artist',
    duration: parseInt(song.duration) || 0,
    imageId: parseInt(song.imageId) || 6031097225  // ✅ Auto-fallback ke default image
  };
}

// Load playlist dari file
function loadPlaylist() {
  try {
    ensureDataFolder();
    
    if (fs.existsSync(PLAYLIST_FILE)) {
      const data = fs.readFileSync(PLAYLIST_FILE, 'utf8');
      let playlist = JSON.parse(data);
      
      // ✅ Normalize semua songs - auto-add missing fields
      playlist = playlist.map(normalizeSong);
      
      // ✅ Auto-save kembali untuk update struktur file
      savePlaylist(playlist);
      
      console.log(`📀 Loaded ${playlist.length} songs from file`);
      return playlist;
    } else {
      // File belum ada, buat dengan default playlist
      console.log('📝 Creating new playlist file...');
      savePlaylist(defaultPlaylist);
      return defaultPlaylist;
    }
  } catch (error) {
    console.error('❌ Error loading playlist:', error.message);
    console.log('🔄 Using default playlist instead');
    return defaultPlaylist;
  }
}

// Save playlist ke file
function savePlaylist(playlist) {
  try {
    ensureDataFolder();
    
    // ✅ Normalize semua songs sebelum save
    const normalizedPlaylist = playlist.map(normalizeSong);
    
    fs.writeFileSync(
      PLAYLIST_FILE, 
      JSON.stringify(normalizedPlaylist, null, 2), 
      'utf8'
    );
    
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
  
  // ✅ Validate required fields
  if (!songData.name || !songData.id) {
    return {
      success: false,
      error: 'name dan id wajib diisi!'
    };
  }
  
  // ✅ Normalize data sebelum add
  const newSong = normalizeSong(songData);
  
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
  
  // ✅ Update hanya field yang dikirim
  const updatedSong = {
    ...playlist[index],
    ...(songData.name && { name: songData.name }),
    ...(songData.id && { id: parseInt(songData.id) }),
    ...(songData.artist && { artist: songData.artist }),
    ...(songData.duration && { duration: parseInt(songData.duration) }),
    ...(songData.imageId && { imageId: parseInt(songData.imageId) })
  };
  
  // ✅ Normalize untuk safety
  playlist[index] = normalizeSong(updatedSong);
  
  savePlaylist(playlist);
  
  return {
    success: true,
    song: playlist[index]
  };
}

// ✅ BONUS: Clear playlist (reset ke default)
function resetPlaylist() {
  savePlaylist(defaultPlaylist);
  console.log('🔄 Playlist reset to default');
  return {
    success: true,
    message: 'Playlist direset ke default',
    totalSongs: defaultPlaylist.length
  };
}

// Export semua functions
module.exports = {
  getPlaylist,
  addSong,
  deleteSong,
  updateSong,
  resetPlaylist,  // ✅ Bonus function
  loadPlaylist,
  savePlaylist
};
