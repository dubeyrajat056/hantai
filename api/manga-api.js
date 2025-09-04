// // NHentai API Integration (Unofficial)

// // NHentai API Integration (Unofficial)

// const MangaAPI = {
//   baseURL: 'https://nhentai.net/api',

//   // Fetch trending/popular mangas (NHentai doesn’t have “trending” endpoint, using search instead)
//   async getTrendingMangas() {
//     try {
//       const response = await fetch(`${this.baseURL}/galleries/search?query=popular&page=1`);
//       const data = await response.json();

//       return data.result.map(manga => ({
//         id: manga.id,
//         title: manga.title.english || manga.title.japanese || "Untitled",
//         thumbnail: `https://t.nhentai.net/galleries/${manga.media_id}/thumb.jpg`,
//         description: "No description available (NHentai does not provide summary).",
//         tags: manga.tags.map(tag => tag.name),
//         pages: manga.num_pages,
//         // ✅ Add chapters array (1 pseudo-chapter)
//         chapters: [
//           {
//             id: manga.id,
//             chapterNumber: 1,
//             title: manga.title.english || manga.title.japanese || "Chapter 1"
//           }
//         ]
//       }));
//     } catch (error) {
//       console.error("Error fetching trending mangas:", error);
//       throw new Error("Failed to fetch trending mangas");
//     }
//   },

//   // Search mangas by title
//   async searchMangas(query) {
//     try {
//       const response = await fetch(`${this.baseURL}/galleries/search?query=${encodeURIComponent(query)}&page=1`);
//       const data = await response.json();

//       return data.result.map(manga => ({
//         id: manga.id,
//         title: manga.title.english || manga.title.japanese || "Untitled",
//         thumbnail: `https://t.nhentai.net/galleries/${manga.media_id}/thumb.jpg`,
//         tags: manga.tags.map(tag => tag.name),
//         pages: manga.num_pages,
//         // ✅ Always provide chapters
//         chapters: [
//           {
//             id: manga.id,
//             chapterNumber: 1,
//             title: manga.title.english || manga.title.japanese || "Chapter 1"
//           }
//         ]
//       }));
//     } catch (error) {
//       console.error("Error searching mangas:", error);
//       throw new Error("Failed to search mangas");
//     }
//   },

//   // Get manga details by ID
//   async getMangaDetails(mangaId) {
//     try {
//       const response = await fetch(`${this.baseURL}/gallery/${mangaId}`);
//       const manga = await response.json();

//       return {
//         id: manga.id,
//         title: manga.title.english || manga.title.japanese || "Untitled",
//         thumbnail: `https://t.nhentai.net/galleries/${manga.media_id}/thumb.jpg`,
//         tags: manga.tags.map(tag => tag.name),
//         pages: manga.num_pages,
//         images: manga.images.pages.map((img, index) =>
//           `https://i.nhentai.net/galleries/${manga.media_id}/${index + 1}.${img.t === "p" ? "png" : "jpg"}`
//         ),
//         // ✅ Add chapters array (maps all pages into one chapter)
//         chapters: [
//           {
//             id: manga.id,
//             chapterNumber: 1,
//             title: manga.title.english || manga.title.japanese || "Chapter 1"
//           }
//         ]
//       };
//     } catch (error) {
//       console.error("Error fetching manga details:", error);
//       throw new Error("Failed to fetch manga details");
//     }
//   },

//   // Get chapter/pages (NHentai does not have chapters, only pages per gallery)
//   async getChapterPages(mangaId) {
//     try {
//       const manga = await this.getMangaDetails(mangaId);
//       return {
//         id: manga.id,
//         chapterNumber: 1,
//         title: manga.title.english || manga.title.japanese || "Chapter 1",
//         pages: manga.images
//       };
//     } catch (error) {
//       console.error("Error fetching chapter pages:", error);
//       throw new Error("Failed to fetch chapter pages");
//     }
//   }
// };

// module.exports = MangaAPI;









// NHentai API Integration (Unofficial)

const MangaAPI = {
  baseURL: 'https://nhentai.net/api',

  // Fetch trending/popular mangas (filtered to English only)
  async getTrendingMangas() {
    try {
      const response = await fetch(`${this.baseURL}/galleries/search?query=popular+language:english&page=1`);
      const data = await response.json();

      return data.result
        .filter(manga => manga.tags.some(tag => tag.type === "language" && tag.name === "english"))
        .map(manga => ({
          id: manga.id,
          title: manga.title.english || manga.title.japanese || "Untitled",
          thumbnail: `https://t.nhentai.net/galleries/${manga.media_id}/thumb.jpg`,
          description: "No description available (NHentai does not provide summary).",
          tags: manga.tags.map(tag => tag.name),
          pages: manga.num_pages,
          // ✅ Add chapters array (1 pseudo-chapter)
          chapters: [
            {
              id: manga.id,
              chapterNumber: 1,
              title: manga.title.english || manga.title.japanese || "Chapter 1"
            }
          ]
        }));
    } catch (error) {
      console.error("Error fetching trending mangas:", error);
      throw new Error("Failed to fetch trending mangas");
    }
  },

  // Search mangas by title (filtered to English only)
  async searchMangas(query) {
    try {
      const response = await fetch(`${this.baseURL}/galleries/search?query=${encodeURIComponent(query)}+language:english&page=1`);
      const data = await response.json();

      return data.result
        .filter(manga => manga.tags.some(tag => tag.type === "language" && tag.name === "english"))
        .map(manga => ({
          id: manga.id,
          title: manga.title.english || manga.title.japanese || "Untitled",
          thumbnail: `https://t.nhentai.net/galleries/${manga.media_id}/thumb.jpg`,
          tags: manga.tags.map(tag => tag.name),
          pages: manga.num_pages,
          // ✅ Always provide chapters
          chapters: [
            {
              id: manga.id,
              chapterNumber: 1,
              title: manga.title.english || manga.title.japanese || "Chapter 1"
            }
          ]
        }));
    } catch (error) {
      console.error("Error searching mangas:", error);
      throw new Error("Failed to search mangas");
    }
  },

  // Get manga details by ID (filter English titles)
  async getMangaDetails(mangaId) {
    try {
      const response = await fetch(`${this.baseURL}/gallery/${mangaId}`);
      const manga = await response.json();

      // If it's not English, skip
      const isEnglish = manga.tags.some(tag => tag.type === "language" && tag.name === "english");
      if (!isEnglish) throw new Error("Manga not available in English");

      return {
        id: manga.id,
        title: manga.title.english || manga.title.japanese || "Untitled",
        thumbnail: `https://t.nhentai.net/galleries/${manga.media_id}/thumb.jpg`,
        tags: manga.tags.map(tag => tag.name),
        pages: manga.num_pages,
        images: manga.images.pages.map((img, index) =>
          `https://i.nhentai.net/galleries/${manga.media_id}/${index + 1}.${img.t === "p" ? "png" : "jpg"}`
        ),
        // ✅ Add chapters array (maps all pages into one chapter)
        chapters: [
          {
            id: manga.id,
            chapterNumber: 1,
            title: manga.title.english || manga.title.japanese || "Chapter 1"
          }
        ]
      };
    } catch (error) {
      console.error("Error fetching manga details:", error);
      throw new Error("Failed to fetch manga details");
    }
  },

  // Get chapter/pages (NHentai does not have chapters, only pages per gallery)
  async getChapterPages(mangaId) {
    try {
      const manga = await this.getMangaDetails(mangaId);
      return {
        id: manga.id,
        chapterNumber: 1,
        title: manga.title.english || manga.title.japanese || "Chapter 1",
        pages: manga.images
      };
    } catch (error) {
      console.error("Error fetching chapter pages:", error);
      throw new Error("Failed to fetch chapter pages");
    }
  }
};

module.exports = MangaAPI;
