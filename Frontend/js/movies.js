import { setNav, qs, toast } from "./ui.js";
import { logout, isLoggedIn } from "./auth.js";
import { initThemeToggle } from "./theme.js";
import { API_BASE } from "./config.js";

setNav();

// Store for all movies (will be populated from TMDB or fallback)
let allMovies = [];

let MOVIES = [
  {
    id: "m1",
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/8c/The_Social_Network_film_poster.png",
    backdropUrl: "assets/backdrops/backdrop1.webp",
    desc: "A thief enters dreams to steal secrets—then must plant an idea."
  },
  {
    id: "m2",
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    trailer: "https://www.youtube.com/embed/zSWdZVtXT7E",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    backdropUrl: "assets/backdrops/backdrop2.webp",
    desc: "A team travels through a wormhole to save humanity."
  },
  {
    id: "m3",
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    trailer: "https://www.youtube.com/embed/EXeTwQWrcwY",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
    backdropUrl: "assets/backdrops/backdrop3.jfif",
    desc: "Batman faces the Joker in Gotham’s darkest hour."
  },
  {
    id: "m4",
    title: "Parasite",
    year: 2019,
    genre: "Thriller",
    trailer: "https://www.youtube.com/embed/SEUXfv87Wpk",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    backdropUrl: "assets/backdrops/backdrop4.webp",
    desc: "A poor family infiltrates a wealthy household—chaos follows."
  },
  {
    id: "m5",
    title: "Dune",
    year: 2021,
    genre: "Sci-Fi",
    trailer: "https://www.youtube.com/embed/n9xhJrPXop4",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg",
    backdropUrl: "assets/backdrops/backdrop5.webp",
    desc: "A noble heir becomes central to a dangerous desert planet."
  },
  {
    id: "m6",
    title: "Joker",
    year: 2019,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/zAGVQLHvwOY",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg",
    backdropUrl: "assets/backdrops/backdrop6.webp",
    desc: "A troubled comedian descends into chaos and notoriety."
  },
  {
    id: "m7",
    title: "The Matrix",
    year: 1999,
    genre: "Sci-Fi",
    trailer: "https://www.youtube.com/embed/vKQi3bBA1y8",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    desc: "A hacker learns the world is a simulation and joins the rebellion."
  },
  {
    id: "m8",
    title: "Fight Club",
    year: 1999,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/qtRKdVHc-cE",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg",
    desc: "An office worker forms an underground fight club with a soap salesman."
  },
  {
    id: "m9",
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime",
    trailer: "https://www.youtube.com/embed/s7EdQ4FqbhY",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
    desc: "Interwoven crime stories with iconic characters and dialogue."
  },
  {
    id: "m10",
    title: "The Godfather",
    year: 1972,
    genre: "Crime",
    trailer: "https://www.youtube.com/embed/sY1S34973zA",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
    desc: "The aging patriarch transfers control of his empire to his son."
  },
  {
    id: "m11",
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/6hB3S9bIaco",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
    desc: "Two imprisoned men bond over years, finding solace and redemption."
  },
  {
    id: "m12",
    title: "Forrest Gump",
    year: 1994,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/bLvqoHBptjg",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
    desc: "A simple man’s extraordinary life across decades of American history."
  },
  {
    id: "m13",
    title: "Gladiator",
    year: 2000,
    genre: "Action",
    trailer: "https://www.youtube.com/embed/owK1qxDselE",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/6e/Mad_Max_Fury_Road.jpg",
    desc: "A betrayed general seeks vengeance in the Roman arena."
  },
  {
    id: "m14",
    title: "La La Land",
    year: 2016,
    genre: "Romance",
    trailer: "https://www.youtube.com/embed/0pdqf4P9MB8",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
    desc: "A jazz musician and an aspiring actress navigate love and ambition."
  },
  {
    id: "m15",
    title: "Whiplash",
    year: 2014,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/7d_jQycdQGo",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/01/Whiplash_poster.jpg",
    desc: "A young drummer faces a brutal instructor pushing him to greatness."
  },
  {
    id: "m16",
    title: "Avengers: Endgame",
    year: 2019,
    genre: "Action",
    trailer: "https://www.youtube.com/embed/TcMBFSGVi1c",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg",
    desc: "The Avengers assemble one last time to undo Thanos’ snap."
  },
  {
    id: "m17",
    title: "Black Panther",
    year: 2018,
    genre: "Action",
    trailer: "https://www.youtube.com/embed/xjDjIWPwcPU",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    desc: "The king of Wakanda faces threats to his nation and legacy."
  },
  {
    id: "m18",
    title: "Titanic",
    year: 1997,
    genre: "Romance",
    trailer: "https://www.youtube.com/embed/kVrqfYjkTdQ",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    desc: "A romance unfolds aboard the ill-fated ship."
  },
  {
    id: "m19",
    title: "Toy Story 3",
    year: 2010,
    genre: "Animation",
    trailer: "https://www.youtube.com/embed/JcpWXaA2qeg",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/69/Toy_Story_3_poster.jpg",
    desc: "Woody and friends face an uncertain future as Andy grows up."
  },
  {
    id: "m20",
    title: "The Social Network",
    year: 2010,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/lB95KLmpLR4",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/8c/The_Social_Network_film_poster.png",
    desc: "The rise of Facebook and the lawsuits that followed."
  },
  {
    id: "m21",
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    genre: "Animation",
    trailer: "https://www.youtube.com/embed/g4Hbz2jLxvQ",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png",
    desc: "Miles Morales becomes Spider-Man across the multiverse."
  },
  {
    id: "m22",
    title: "Mad Max: Fury Road",
    year: 2015,
    genre: "Action",
    trailer: "https://www.youtube.com/embed/hEJnMQG9ev8",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/6e/Mad_Max_Fury_Road.jpg",
    desc: "A high-octane chase through a post-apocalyptic wasteland."
  },
  {
    id: "m23",
    title: "The Prestige",
    year: 2006,
    genre: "Mystery",
    trailer: "https://www.youtube.com/embed/ELq7F2HKnAY",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    desc: "Two rival magicians engage in a dangerous competition."
  },
  {
    id: "m24",
    title: "Memento",
    year: 2000,
    genre: "Thriller",
    trailer: "https://www.youtube.com/embed/0vS0E9bBSZ0",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/6e/Mad_Max_Fury_Road.jpg",
    desc: "A man with short-term memory loss hunts his wife's killer."
  },
  {
    id: "m25",
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    desc: "Dreams within dreams in a corporate espionage thriller."
  },
  {
    id: "m26",
    title: "The Wolf of Wall Street",
    year: 2013,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/iszwuX1AXpQ",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg",
    desc: "A ruthless stockbroker's rise and fall through excess."
  },
  {
    id: "m27",
    title: "Moonlight",
    year: 2016,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/9MzWWgS9-m8",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
    desc: "A coming-of-age story of a young Black man in Miami."
  },
  {
    id: "m28",
    title: "Get Out",
    year: 2017,
    genre: "Horror",
    trailer: "https://www.youtube.com/embed/Dzich7fcXoQ",
    posterUrl:"https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg", 
    desc: "A chilling psychological thriller about sinister secrets."
  },
  {
    id: "m29",
    title: "Hereditary",
    year: 2018,
    genre: "Horror",
    trailer: "https://www.youtube.com/embed/V6wWKNij_1M",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png",
    desc: "A family unravels dark secrets after a death."
  },
  {
    id: "m30",
    title: "Green Book",
    year: 2018,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/ouN6A_yGX-w",
    posterUrl:"https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    desc: "A friendship between a pianist and his driver in the 1960s."
  },
  {
    id: "m31",
    title: "The Farewell",
    year: 2019,
    genre: "Comedy",
    trailer: "https://www.youtube.com/embed/c-DXnc6DUkc",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
    desc: "A family decides to keep their grandmother's diagnosis a secret."
  },
  {
    id: "m32",
    title: "Uncut Gems",
    year: 2019,
    genre: "Thriller",
    trailer: "https://www.youtube.com/embed/K5le9sSIcVs",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png",
    desc: "A jeweler's dangerous obsession with a rare gem."
  },
  {
    id: "m33",
    title: "Knives Out",
    year: 2019,
    genre: "Mystery",
    trailer: "https://www.youtube.com/embed/D5L11B7gEWI",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg",
    desc: "A detective unravels a family mystery after a murder."
  },
  {
    id: "m34",
    title: "1917",
    year: 2019,
    genre: "War",
    trailer: "https://www.youtube.com/embed/XrpzRJ_5gSE",
    posterUrl:"https://upload.wikimedia.org/wikipedia/en/6/6e/Mad_Max_Fury_Road.jpg",
    desc: "Two soldiers race against time in World War I."
  },
  {
    id: "m35",
    title: "Parasite",
    year: 2019,
    genre: "Thriller",
    trailer: "https://www.youtube.com/embed/SEUXfv87Wpk",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    desc: "A poor family's clever infiltration of wealth."
  },
  {
    id: "m36",
    title: "Tenet",
    year: 2020,
    genre: "Sci-Fi",
    trailer: "https://www.youtube.com/embed/L3pk_TBkiTC",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg",
    desc: "A secret agent works to prevent an apocalypse."
  },
  {
    id: "m37",
    title: "The Lighthouse",
    year: 2019,
    genre: "Drama",
    trailer: "https://www.youtube.com/embed/h_G0y0VeRyE",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/f/fa/Spider-Man_Into_the_Spider-Verse_poster.png",
    desc: "Two keepers maintain an isolated lighthouse."
  },
  {
    id: "m38",
    title: "Midsommar",
    year: 2019,
    genre: "Horror",
    trailer: "https://www.youtube.com/embed/FzCrtMHUaI8",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg",
    desc: "A festival becomes a nightmare for outsiders."
  },
  {
    id: "m39",
    title: "A Quiet Place",
    year: 2018,
    genre: "Horror",
    trailer: "https://www.youtube.com/embed/-OMJuCi-F0s",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
    desc: "A family must survive in silence from deadly creatures."
  },
  {
    id: "m40",
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: "Sci-Fi",
    trailer: "https://www.youtube.com/embed/nCiHcgVK8zw",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    desc: "A multiverse adventure with emotional depth and action."
  }
];

const moviesGrid = qs("#moviesGrid");
const searchInput = qs("#searchInput");
const clearSearch = qs("#clearSearch");
const chipsEl = qs("#chips");
const countLabel = qs("#countLabel");

const hero = qs("#hero");
const heroTitle = qs("#heroTitle");
const heroDesc = qs("#heroDesc");
const heroMeta = qs("#heroMeta");
const heroOpenBtn = qs("#heroOpenBtn");
const heroTrailerBtn = qs("#heroTrailerBtn");

const trailerModal = qs("#trailerModal");
const trailerFrame = qs("#trailerFrame");
const trailerTitle = qs("#trailerTitle");

/* =========================
   THEME
========================= */
initThemeToggle();

/* =========================
   AUTH NAV
========================= */
const logoutBtn = qs("#logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logout();
    toast("Logged out", "success");
    window.location.reload();
  });
}

/* =========================
   FILTERS
========================= */
let activeGenre = "All";
let query = "";

function renderChips() {
  chipsEl.innerHTML = "";
  const genres = ["All", ...Array.from(new Set(allMovies.map(m => m.genre)))];
  genres.forEach(g => {
    const btn = document.createElement("button");
    btn.className = `chip ${g === activeGenre ? "chip--active" : ""}`;
    btn.textContent = g;
    btn.addEventListener("click", () => {
      activeGenre = g;
      renderChips();
      render();
    });
    chipsEl.appendChild(btn);
  });
}

/* =========================
   HERO
========================= */
function setHero(movie) {
  heroTitle.textContent = movie.title;
  heroDesc.textContent = movie.desc || "Open details, play trailer, and write your review.";
  heroMeta.innerHTML = `
    <span class="badge">🎬 ${movie.year}</span>
    <span class="badge">🏷️ ${movie.genre}</span>
    <span class="badge">⭐ Rate 1–10</span>
  `;

  // background poster / backdrop
  const overlay = hero.querySelector(".hero__overlay");
  const backdrop = movie.backdropUrl || `https://source.unsplash.com/1600x900/?${encodeURIComponent(movie.title)},movie`;
  overlay.style.backgroundImage = `url('${backdrop}')`;
  overlay.style.backgroundSize = 'cover';
  overlay.style.backgroundPosition = 'center';

  const url = `movie.html?id=${encodeURIComponent(movie.id)}&title=${encodeURIComponent(movie.title)}&trailer=${encodeURIComponent(movie.trailer)}&poster=${encodeURIComponent(movie.posterUrl)}&year=${movie.year}&genre=${encodeURIComponent(movie.genre)}`;
  heroOpenBtn.href = url;

  heroTrailerBtn.onclick = () => openTrailer(movie.title, movie.trailer);
}

/* =========================
   MODAL
========================= */
function openTrailer(title, url) {
  trailerTitle.textContent = `${title} — Trailer`;
  trailerFrame.src = url + "?autoplay=1";
  trailerModal.classList.add("show");
  trailerModal.setAttribute("aria-hidden", "false");
}
function closeTrailer() {
  trailerModal.classList.remove("show");
  trailerModal.setAttribute("aria-hidden", "true");
  trailerFrame.src = "";
}
qs("#closeTrailer").addEventListener("click", closeTrailer);
trailerModal.addEventListener("click", (e) => {
  if (e.target === trailerModal) closeTrailer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeTrailer();
});

/* =========================
   GRID RENDER
========================= */
function cardHTML(m) {
  const url = `movie.html?id=${encodeURIComponent(m.id)}&title=${encodeURIComponent(m.title)}&trailer=${encodeURIComponent(m.trailer)}&poster=${encodeURIComponent(m.posterUrl)}&year=${m.year}&genre=${encodeURIComponent(m.genre)}`;

  // We use <img> with onerror fallback
  return `
    <a class="card" href="${url}">
      <div class="poster">
        <img src="${m.posterUrl}" alt="${m.title} poster"
             loading="lazy"
             onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, rgba(229,9,20,.18), rgba(120,88,255,.12))';" />
      </div>
      <div class="card__info">
        <h3 class="card__title">${m.title}</h3>
        <div class="card__meta">
          <span class="tag">${m.year}</span>
          <span class="tag">${m.genre}</span>
        </div>
      </div>
    </a>
  `;
}

function getFiltered() {
  let list = [...allMovies];
  
  // Show first 20 movies if not logged in, all if logged in
  if (!isLoggedIn()) {
    list = list.slice(0, 20);
  }

  if (activeGenre !== "All") {
    list = list.filter(m => m.genre === activeGenre);
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(m => m.title.toLowerCase().includes(q));
  }
  return list;
}

function render() {
  const list = getFiltered();
  moviesGrid.innerHTML = list.map(cardHTML).join("");
  countLabel.textContent = `${list.length} movies`;
}

/* =========================
   SEARCH
========================= */
searchInput.addEventListener("input", () => {
  query = (searchInput.value || "").trim();
  render();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  query = "";
  render();
  searchInput.focus();
});

/* =========================
   FETCH TMDB MOVIES (if logged in)
========================= */
async function fetchTmdbMovies() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Not logged in, using fallback movies");
      allMovies = MOVIES;
      initializeUI();
      return;
    }

    const response = await fetch(`${API_BASE}/movies/tmdb/popular`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
      console.warn("Failed to fetch TMDB movies, using fallback");
      allMovies = MOVIES;
      initializeUI();
      return;
    }

    const data = await response.json();
    const tmdbMovies = data.movies.map((m, idx) => ({
      id: `tmdb-${m.id}`,
      title: m.title,
      year: m.releaseDate ? new Date(m.releaseDate).getFullYear() : 2024,
      genre: m.genreIds && m.genreIds.length > 0 ? getGenreName(m.genreIds[0]) : "Drama",
      trailer: "", // TMDB doesn't provide trailer URLs directly
      posterUrl: m.posterPath || "https://via.placeholder.com/300x450?text=" + encodeURIComponent(m.title),
      backdropUrl: m.backdropPath || `https://source.unsplash.com/1600x900/?${encodeURIComponent(m.title)},movie`,
      desc: m.overview || "Click to learn more about this movie",
      rating: m.voteAverage || 0
    }));

    allMovies = tmdbMovies.length > 0 ? tmdbMovies : MOVIES;
    console.log(`Loaded ${allMovies.length} movies from TMDB`);
    initializeUI();
  } catch (err) {
    console.error("Error fetching TMDB movies:", err);
    allMovies = MOVIES;
    initializeUI();
  }
}

// Simple genre mapping for TMDB genre IDs
function getGenreName(genreId) {
  const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
  };
  return genres[genreId] || "Drama";
}

function initializeUI() {
  renderChips();
  render();

  // Set a featured hero movie (first one)
  if (allMovies.length > 0) {
    setHero(allMovies[0]);

    // Optional: rotate featured every 7 seconds (Netflix vibe)
    let heroIndex = 0;
    setInterval(() => {
      if (allMovies.length > 0) {
        heroIndex = (heroIndex + 1) % allMovies.length;
        setHero(allMovies[heroIndex]);
      }
    }, 7000);
  }
}

/* =========================
   INIT
========================= */
fetchTmdbMovies();

