// const express = require('express');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Set EJS as templating engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({ extended: true }));

// // Sample data (in a real app, this would be a database)
// const mangaData = JSON.parse(fs.readFileSync('./data/manga.json', 'utf8'));
// let usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

// // Routes
// app.get('/', (req, res) => {
//   res.render('home', { 
//     title: 'Manga Reader - Home',
//     manga: mangaData.slice(0, 12) // Show first 12 manga
//   });
// });

// app.get('/search', (req, res) => {
//   const query = req.query.q || '';
//   let results = mangaData;
  
//   if (query) {
//     results = mangaData.filter(manga => 
//       manga.title.toLowerCase().includes(query.toLowerCase())
//     );
//   }
  
//   res.render('search', { 
//     title: 'Manga Reader - Search',
//     query,
//     results
//   });
// });

// app.get('/manga/:id', (req, res) => {
//   const manga = mangaData.find(m => m.id === parseInt(req.params.id));
//   if (!manga) {
//     return res.status(404).render('404', { title: 'Manga Not Found' });
//   }
  
//   res.render('manga-details', { 
//     title: `Manga Reader - ${manga.title}`,
//     manga
//   });
// });

// app.get('/read/:mangaId/:chapterId', (req, res) => {
//   const manga = mangaData.find(m => m.id === parseInt(req.params.mangaId));
//   if (!manga) {
//     return res.status(404).render('404', { title: 'Manga Not Found' });
//   }
  
//   const chapter = manga.chapters.find(c => c.id === parseInt(req.params.chapterId));
//   if (!chapter) {
//     return res.status(404).render('404', { title: 'Chapter Not Found' });
//   }
  
//   res.render('reader', { 
//     title: `Reading ${manga.title} - Chapter ${chapter.chapterNumber}`,
//     manga,
//     chapter
//   });
// });

// app.get('/profile', (req, res) => {
//   // For demo purposes, using user with ID 1
//   const user = usersData.find(u => u.id === 1);
  
//   res.render('profile', { 
//     title: 'Manga Reader - Profile',
//     user
//   });
// });

// // API Routes for user actions
// app.post('/api/read-later/:mangaId', (req, res) => {
//   const mangaId = parseInt(req.params.mangaId);
//   const user = usersData.find(u => u.id === 1); // Demo user
  
//   if (!user.readLater.includes(mangaId)) {
//     user.readLater.push(mangaId);
//     fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
//   }
  
//   res.json({ success: true });
// });

// app.post('/api/remove-read-later/:mangaId', (req, res) => {
//   const mangaId = parseInt(req.params.mangaId);
//   const user = usersData.find(u => u.id === 1); // Demo user
  
//   user.readLater = user.readLater.filter(id => id !== mangaId);
//   fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
  
//   res.json({ success: true });
// });

// app.post('/api/mark-read/:mangaId/:chapterId', (req, res) => {
//   const mangaId = parseInt(req.params.mangaId);
//   const chapterId = parseInt(req.params.chapterId);
//   const user = usersData.find(u => u.id === 1); // Demo user
  
//   // Add to library if not already there
//   if (!user.library.some(item => item.mangaId === mangaId)) {
//     user.library.push({ mangaId, lastReadChapter: chapterId });
//   } else {
//     // Update last read chapter
//     const item = user.library.find(item => item.mangaId === mangaId);
//     item.lastReadChapter = chapterId;
//   }
  
//   fs.writeFileSync('./data/users.json', JSON.stringify(usersData, null, 2));
//   res.json({ success: true });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Manga Reader app running on http://localhost:${PORT}`);
// });


const express = require('express');
const path = require('path');
const mangaAPI = require('./api/manga-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', async (req, res) => {
  try {
    // FIX: Changed variable name from 'mangas' to 'manga'
    const manga = await mangaAPI.getTrendingMangas();
    res.render('home', { 
      title: 'Manga Reader - Home',
      manga // FIX: Changed from 'mangas' to 'manga'
    });
  } catch (error) {
    console.error('Error fetching trending mangas:', error);
    res.status(500).render('error', {
      title: 'Error - Manga Reader',
      message: 'Failed to load manga list. Please try again later.'
    });
  }
});

app.get('/search', async (req, res) => {
  const query = req.query.q || '';
  
  try {
    let results = [];
    if (query) {
      results = await mangaAPI.searchMangas(query);
    }
    
    res.render('search', { 
      title: 'Manga Reader - Search',
      query,
      results
    });
  } catch (error) {
    console.error('Error searching mangas:', error);
    res.status(500).render('error', {
      title: 'Error - Manga Reader',
      message: 'Search failed. Please try again later.'
    });
  }
});

app.get('/manga/:id', async (req, res) => {
  try {
    const manga = await mangaAPI.getMangaDetails(req.params.id);
    if (!manga) {
      return res.status(404).render('error', {
        title: 'Manga Not Found - Manga Reader',
        message: 'The requested manga could not be found.'
      });
    }
    
    res.render('manga-details', { 
      title: `Manga Reader - ${manga.title}`,
      manga
    });
  } catch (error) {
    console.error('Error fetching manga details:', error);
    res.status(500).render('error', {
      title: 'Error - Manga Reader',
      message: 'Failed to load manga details. Please try again later.'
    });
  }
});

app.get('/read/:mangaId/:chapterId', async (req, res) => {
  try {
    const manga = await mangaAPI.getMangaDetails(req.params.mangaId);
    if (!manga) {
      return res.status(404).render('error', {
        title: 'Manga Not Found - Manga Reader',
        message: 'The requested manga could not be found.'
      });
    }
    
    const chapter = await mangaAPI.getChapterPages(req.params.mangaId, req.params.chapterId);
    if (!chapter) {
      return res.status(404).render('error', {
        title: 'Chapter Not Found - Manga Reader',
        message: 'The requested chapter could not be found.'
      });
    }
    
    res.render('chapter-reader', { 
      title: `Reading ${manga.title} - Chapter ${chapter.chapterNumber}`,
      manga,
      chapter
    });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).render('error', {
      title: 'Error - Manga Reader',
      message: 'Failed to load chapter. Please try again later.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Manga Reader app running on http://localhost:${PORT}`);
});