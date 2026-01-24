// server.js
const express = require('express');
const cors = require('cors');
const playlist = require('./playlist');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// ROUTES / ENDPOINTS
// ============================================

// GET / - Homepage
app.get('/', (req, res) => {
  const currentPlaylist = playlist.getPlaylist();
  
  res.send(`
    <h1>🎵 Roblox Music API</h1>
    <p>Server is running!</p>
    <h3>Endpoints:</h3>
    <ul>
      <li><a href="/api/playlist">GET /api/playlist</a> - Get semua lagu</li>
      <li>POST /api/playlist - Tambah lagu baru</li>
      <li>POST /api/request - Request lagu dari Roblox</li>
      <li>PUT /api/playlist/:index - Update lagu</li>
      <li>DELETE /api/playlist/:index - Hapus lagu</li>
    </ul>
    <h3>Current Playlist (${currentPlaylist.length} songs):</h3>
    <pre>${JSON.stringify(currentPlaylist, null, 2)}</pre>
  `);
});

// GET /api/playlist - Ambil semua playlist
app.get('/api/playlist', (req, res) => {
  console.log('📥 GET /api/playlist - Request received');
  
  const currentPlaylist = playlist.getPlaylist();
  res.json(currentPlaylist);
});

// ✅ NEW: POST /api/request - Request dari Roblox player
app.post('/api/request', (req, res) => {
  const { songId, songName, requestedBy, playerUserId } = req.body;
  
  console.log('🎵 Song request from:', requestedBy || 'Unknown');
  console.log('   Song ID:', songId);
  
  // Validasi
  if (!songId) {
    return res.status(400).json({ 
      success: false,
      error: 'songId harus diisi!' 
    });
  }
  
  // Tambah lagu ke playlist
  const result = playlist.addSong({ 
    name: songName || `Requested Song ${songId}`, 
    id: songId, 
    artist: requestedBy || 'Player Request', 
    duration: 0,  // Akan di-detect otomatis di Roblox
    imageId: 6031097225,  // Default image
    requestedBy: requestedBy,
    playerUserId: playerUserId
  });
  
  if (result.success) {
    console.log('✅ Song added to playlist:', result.song.name);
    
    res.json({
      success: true,
      message: `Lagu berhasil ditambahkan ke playlist! (Position: ${result.totalSongs})`,
      song: result.song,
      position: result.totalSongs,
      totalSongs: result.totalSongs
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.error
    });
  }
});

// POST /api/playlist - Tambah lagu manual
app.post('/api/playlist', (req, res) => {
  const { name, id, artist, duration, imageId } = req.body;
  
  if (!id) {
    return res.status(400).json({ 
      error: 'id harus diisi!' 
    });
  }
  
  const result = playlist.addSong({ 
    name: name || `Song ${id}`, 
    id, 
    artist: artist || 'Unknown', 
    duration: duration || 0, 
    imageId: imageId || 6031097225
  });
  
  console.log('✅ Lagu baru ditambahkan:', result.song);
  
  res.status(201).json({
    success: true,
    message: 'Lagu berhasil ditambahkan!',
    song: result.song,
    totalSongs: result.totalSongs
  });
});

// DELETE /api/playlist/:index
app.delete('/api/playlist/:index', (req, res) => {
  const index = parseInt(req.params.index);
  
  if (isNaN(index)) {
    return res.status(400).json({ 
      error: 'Index harus berupa angka!' 
    });
  }
  
  const result = playlist.deleteSong(index);
  
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  
  console.log('🗑️ Lagu dihapus:', result.deleted);
  
  res.json({
    success: true,
    message: 'Lagu berhasil dihapus!',
    deleted: result.deleted,
    totalSongs: result.totalSongs
  });
});

// PUT /api/playlist/:index
app.put('/api/playlist/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { name, id, artist, duration, imageId } = req.body;
  
  if (isNaN(index)) {
    return res.status(400).json({ 
      error: 'Index harus berupa angka!' 
    });
  }
  
  const result = playlist.updateSong(index, { name, id, artist, duration, imageId });
  
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  
  console.log('✏️ Lagu diupdate:', result.song);
  
  res.json({
    success: true,
    message: 'Lagu berhasil diupdate!',
    song: result.song
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  const currentPlaylist = playlist.getPlaylist();
  
  console.log('=================================');
  console.log('🎵 Roblox Music API Server');
  console.log('=================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Playlist: http://localhost:${PORT}/api/playlist`);
  console.log(`🎵 Total lagu: ${currentPlaylist.length}`);
  console.log('=================================');
  console.log('Press Ctrl+C to stop');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n👋 Server stopped');
  process.exit(0);
});
