import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './database/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'
import songRoutes from './routes/song.routes.js';
import artistRoutes from './routes/artist.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import playlistRoutes from './routes/playlist.routes.js'
import path from 'path'
import job from './utils/cron.js';

dotenv.config();
const __dirname = path.resolve();
const app = express();
const port = process.env.PORT || 4040;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*",
  credentials: true, 
  maxAgeSeconds: 3600,
  responseHeader: ['Content-Type', 'Content-Range']
}));
app.use(express.static(path.join(__dirname, '/client/dist')));


app.use('/api/auth',authRoutes);
app.use('/api/song', songRoutes);
app.use('/api/artist',artistRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/playlist',playlistRoutes);

connectDB();
// job.start();

app.get('*',(req,res)=>{
      res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
}) 
app.listen(port, () => console.log(`Server running on port ${port}`));
app.use((error, _, res,next) => {
    const status = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

