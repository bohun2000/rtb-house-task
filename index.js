import express from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

const mongoUrl = process.env.MONGO_URL || '//mongo:27017/web_app_db';

await mongoose.connect(mongoUrl);

const User = mongoose.model('User', {
  userId: String,
  scrolledToImage: Boolean
});

app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { userId: '' });
});

app.post('/api/user', async (req, res) => {
  try {
    const response = await fetch('https://random-data-api.com/api/v2/users');
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const userData = await response.json();
    
    const user = new User({
      userId: userData.uid,
      scrolledToImage: false
    });
    await user.save();
    
    res.json({ userId: userData.uid });
  } catch (error) {
    console.error('Error while creating new user:', error);
    res.status(500).json({ error: 'Error while creating new user' });
  }
});

app.post('/api/scroll', async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findOneAndUpdate({ userId }, { scrolledToImage: true });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error while updating user scroll status:', error);
    res.status(500).json({ error: 'Error while updating user scroll status' });
  }
});

app.get('/report', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const scrolledUsers = await User.countDocuments({ scrolledToImage: true });
    const scrollPercentage = totalUsers > 0 ? (scrolledUsers / totalUsers) * 100 : 0;
    
    res.render('report', {
      totalUsers,
      scrollPercentage: scrollPercentage.toFixed(2)
    });
  } catch (error) {
    console.error('Error while generating report:', error);
    res.status(500).render('error', { error: 'Error while generating report' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});