import express from 'express';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { verifyToken } from '../utils/verifyToken.js';
import { createPlaylist, deletePlaylist, getPlaylist, getPlaylists, updatePlaylist } from '../controllers/playlist.controller.js';

const router = express.Router();

router.post('/create',verifyToken, verifyAdmin, createPlaylist);
router.get('/',getPlaylists);
router.get('/:playlistId',getPlaylist);
router.put('/:id',verifyToken,  verifyAdmin, updatePlaylist);
router.delete('/:playlistId',verifyToken, verifyAdmin, deletePlaylist);

export default router;