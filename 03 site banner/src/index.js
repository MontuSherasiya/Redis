import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const BANNER_KEY = 'app:banner';

app.post('/banner', async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to our site!");
    res.status(201).json({ success: true });
});

app.get('/banner', async (req, res) => {
    const message = await redis.get(BANNER_KEY);
    res.json({ message });
});

app.get('/banner/exists', async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({ exists: exists });
});

app.delete('/banner', async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Banner service running on "http://localhost:3000"');
});