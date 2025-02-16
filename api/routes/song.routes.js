import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import { addNewSong, deleteSong, getSongs, addToFavourite, removeFromFavourite, searchedSongs, getSong, updateSong } from '../controllers/song.controller.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

router.post('/add-new-song', verifyToken, addNewSong);
router.get('/', getSongs);
router.get('/search', searchedSongs);
router.post('/add-to-favourite/:songId', verifyToken, addToFavourite);
router.post('/remove-from-favourite/:songId', verifyToken, removeFromFavourite);
router.put('/update/:songId',verifyToken, verifyAdmin, updateSong)
router.delete('/:Id',verifyToken,deleteSong)
router.get('/:songId', getSong);
export default router