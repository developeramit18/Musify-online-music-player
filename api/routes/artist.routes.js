import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import { addNewArtist, deleteArtist, getArtist, getArtists, searchArtist, updateArtist } from '../controllers/artist.controller.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';


const router = express.Router();

router.post('/add-new-artist', verifyToken, verifyAdmin, addNewArtist);
router.get('/search', searchArtist);
router.get('/',getArtists);
router.get('/:artistId', getArtist);
router.put('/:id',verifyToken,  verifyAdmin, updateArtist);
router.delete('/:Id', verifyToken, verifyAdmin, deleteArtist);
export default router