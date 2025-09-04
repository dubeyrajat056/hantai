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








// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const mangaAPI = require('./api/manga-api');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Set EJS as templating engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // User data storage (in a real app, this would be a database)
// let userData = {
//   id: 1,
//   username: 'mangalover',
//   email: 'user@example.com',
//   readLater: [],
//   library: [],
//   settings: {
//     theme: 'dark',
//     readerMode: 'single-page',
//     notifications: true
//   }
// };

// // Try to load user data from file if it exists
// try {
//   if (fs.existsSync('./user-data.json')) {
//     const data = fs.readFileSync('./user-data.json', 'utf8');
//     userData = JSON.parse(data);
//   }
// } catch (err) {
//   console.error('Error loading user data:', err);
// }

// // Save user data to file
// function saveUserData() {
//   try {
//     fs.writeFileSync('./user-data.json', JSON.stringify(userData, null, 2));
//   } catch (err) {
//     console.error('Error saving user data:', err);
//   }
// }

// // Routes
// app.get('/', async (req, res) => {
//   try {
//     const manga = await mangaAPI.getTrendingMangas();
//     res.render('home', {
//       title: 'Manga Reader - Home',
//       manga
//     });
//   } catch (error) {
//     console.error('Error fetching trending mangas:', error);
//     res.status(500).render('error', {
//       title: 'Error - Manga Reader',
//       message: 'Failed to load manga list. Please try again later.'
//     });
//   }
// });

// app.get('/search', async (req, res) => {
//   const query = req.query.q || '';

//   try {
//     let results = [];
//     if (query) {
//       results = await mangaAPI.searchMangas(query);
//     }

//     res.render('search', {
//       title: 'Manga Reader - Search',
//       query,
//       results
//     });
//   } catch (error) {
//     console.error('Error searching mangas:', error);
//     res.status(500).render('error', {
//       title: 'Error - Manga Reader',
//       message: 'Search failed. Please try again later.'
//     });
//   }
// });

// app.get('/manga/:id', async (req, res) => {
//   try {
//     const manga = await mangaAPI.getMangaDetails(req.params.id);
//     if (!manga) {
//       return res.status(404).render('error', {
//         title: 'Manga Not Found - Manga Reader',
//         message: 'The requested manga could not be found.'
//       });
//     }

//     // Check if manga is in read later
//     const inReadLater = userData.readLater.includes(manga.id);

//     res.render('manga-details', {
//       title: `Manga Reader - ${manga.title}`,
//       manga,
//       inReadLater
//     });
//   } catch (error) {
//     console.error('Error fetching manga details:', error);
//     res.status(500).render('error', {
//       title: 'Error - Manga Reader',
//       message: 'Failed to load manga details. Please try again later.'
//     });
//   }
// });

// app.get('/read/:mangaId/:chapterId', async (req, res) => {
//   try {
//     const manga = await mangaAPI.getMangaDetails(req.params.mangaId);
//     if (!manga) {
//       return res.status(404).render('error', {
//         title: 'Manga Not Found - Manga Reader',
//         message: 'The requested manga could not be found.'
//       });
//     }

//     const chapter = await mangaAPI.getChapterPages(req.params.mangaId, req.params.chapterId);
//     if (!chapter) {
//       return res.status(404).render('error', {
//         title: 'Chapter Not Found - Manga Reader',
//         message: 'The requested chapter could not be found.'
//       });
//     }

//     // Add to library (mark as reading)
//     const libraryItem = userData.library.find(item => item.mangaId === req.params.mangaId);
//     if (libraryItem) {
//       libraryItem.lastReadChapter = req.params.chapterId;
//       libraryItem.lastRead = new Date();
//     } else {
//       userData.library.push({
//         mangaId: req.params.mangaId,
//         lastReadChapter: req.params.chapterId,
//         lastRead: new Date(),
//         added: new Date()
//       });
//     }
//     saveUserData();

//     res.render('chapter-reader', {
//       title: `Reading ${manga.title} - Chapter ${chapter.chapterNumber}`,
//       manga,
//       chapter
//     });
//   } catch (error) {
//     console.error('Error fetching chapter:', error);
//     res.status(500).render('error', {
//       title: 'Error - Manga Reader',
//       message: 'Failed to load chapter. Please try again later.'
//     });
//   }
// });

// // Read Later and Library Pages
// app.get('/read-later', async (req, res) => {
//   try {
//     const readLaterMangas = [];

//     for (const mangaId of userData.readLater) {
//       const manga = await mangaAPI.getMangaDetails(mangaId);
//       if (manga) {
//         readLaterMangas.push(manga);
//       }
//     }

//     res.render('read-later', {
//       title: 'Manga Reader - Read Later',
//       mangas: readLaterMangas
//     });
//   } catch (error) {
//     console.error('Error loading read later:', error);
//     res.status(500).render('error', {
//       title: 'Error - Manga Reader',
//       message: 'Failed to load read later list. Please try again later.'
//     });
//   }
// });

// app.get('/library', async (req, res) => {
//   try {
//     const libraryMangas = [];

//     for (const item of userData.library) {
//       const manga = await mangaAPI.getMangaDetails(item.mangaId);
//       if (manga) {
//         // Add library info to the manga object
//         manga.libraryInfo = item;
//         libraryMangas.push(manga);
//       }
//     }

//     // Sort by last read date (newest first)
//     libraryMangas.sort((a, b) => new Date(b.libraryInfo.lastRead) - new Date(a.libraryInfo.lastRead));

//     res.render('library', {
//       title: 'Manga Reader - Library',
//       mangas: libraryMangas
//     });
//   } catch (error) {
//     console.error('Error loading library:', error);
//     res.status(500).render('error', {
//       title: 'Error - Manga Reader',
//       message: 'Failed to load library. Please try again later.'
//     });
//   }
// });

// // API Routes
// app.post('/api/read-later/:mangaId', (req, res) => {
//   const mangaId = req.params.mangaId;

//   if (!userData.readLater.includes(mangaId)) {
//     userData.readLater.push(mangaId);
//     saveUserData();
//     res.json({ success: true, action: 'added' });
//   } else {
//     res.json({ success: false, message: 'Already in read later' });
//   }
// });

// app.delete('/api/read-later/:mangaId', (req, res) => {
//   const mangaId = req.params.mangaId;

//   userData.readLater = userData.readLater.filter(id => id !== mangaId);
//   saveUserData();
//   res.json({ success: true, action: 'removed' });
// });

// app.delete('/api/library/:mangaId', (req, res) => {
//   const mangaId = req.params.mangaId;

//   userData.library = userData.library.filter(item => item.mangaId !== mangaId);
//   saveUserData();
//   res.json({ success: true, action: 'removed' });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Manga Reader app running on http://localhost:${PORT}`);
// });