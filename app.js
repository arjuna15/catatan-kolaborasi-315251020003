
const CONFIG = {
    TMDB_API_KEY: '15d2ea6d0dc1d476efbca3eba2b9bbfb',
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
    BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/original'
};

const state = {
    animeList: [],
    filteredList: [],
    activeAnime: null,
    currentSeason: 1,
    currentEpisode: 1,
    activeServer: 'multiembed',
    currentTab: 'home',
    currentGenre: 'all',
    currentDay: 'senin',
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 24,
    autoNext: localStorage.getItem('sameha_auto_next') !== 'false',
    autoNextTimer: null,
    watchlist: JSON.parse(localStorage.getItem('sameha_watchlist') || '[]')
};

const SERVERS = {
    'multiembed': (anime, s = 1, e = 1) => {
        if (anime.direct_embeds && (anime.direct_embeds[e] || anime.direct_embeds[String(e)])) {
            return anime.direct_embeds[e] || anime.direct_embeds[String(e)];
        }
        return anime.type === 'movie'
            ? 'https://multiembed.mov/?video_id=' + anime.id + '&tmdb=1'
            : 'https://multiembed.mov/?video_id=' + anime.id + '&tmdb=1&s=' + s + '&e=' + e;
    },
    'otakudesu': (anime, s = 1, e = 1) => {
        if (anime.direct_embeds && (anime.direct_embeds[e] || anime.direct_embeds[String(e)])) {
            return anime.direct_embeds[e] || anime.direct_embeds[String(e)];
        }
        return anime.type === 'movie'
            ? 'https://multiembed.mov/?video_id=' + anime.id + '&tmdb=1'
            : 'https://multiembed.mov/?video_id=' + anime.id + '&tmdb=1&s=' + s + '&e=' + e;
    },
    'vidsrc': (anime, s = 1, e = 1) => {
        if (anime.direct_embeds && (anime.direct_embeds[e] || anime.direct_embeds[String(e)])) {
            return anime.direct_embeds[e] || anime.direct_embeds[String(e)];
        }
        return anime.type === 'movie'
            ? 'https://vidsrc.me/embed/movie?tmdb=' + anime.id
            : 'https://vidsrc.me/embed/tv?tmdb=' + anime.id + '&season=' + s + '&episode=' + e;
    },
    'autoembed': (anime, s = 1, e = 1) => {
        if (anime.direct_embeds && (anime.direct_embeds[e] || anime.direct_embeds[String(e)])) {
            return anime.direct_embeds[e] || anime.direct_embeds[String(e)];
        }
        return anime.type === 'movie'
            ? 'https://autoembed.co/movie/tmdb/' + anime.id
            : 'https://autoembed.co/tv/tmdb/' + anime.id + '-' + s + '-' + e;
    },
    '2embed': (anime, s = 1, e = 1) => {
        if (anime.direct_embeds && (anime.direct_embeds[e] || anime.direct_embeds[String(e)])) {
            return anime.direct_embeds[e] || anime.direct_embeds[String(e)];
        }
        return anime.type === 'movie'
            ? 'https://www.2embed.cc/embed/' + anime.id
            : 'https://www.2embed.cc/embedtv/' + anime.id + '&s=' + s + '&e=' + e;
    },
    'nontongo': (anime, s = 1, e = 1) => {
        if (anime.direct_embeds && (anime.direct_embeds[e] || anime.direct_embeds[String(e)])) {
            return anime.direct_embeds[e] || anime.direct_embeds[String(e)];
        }
        return anime.type === 'movie'
            ? 'https://www.nontongo.win/embed/movie/' + anime.id
            : 'https://www.nontongo.win/embed/tv/' + anime.id + '/' + s + '/' + e;
    }
};

const el = {};

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    bindEvents();
    loadAnimeCatalog();
    updateFavCount();
});

function cacheElements() {
    el.animeGrid = document.getElementById('anime-grid');
    el.searchInput = document.getElementById('search-input');
    el.clearSearch = document.getElementById('clear-search');
    el.catalogCount = document.getElementById('catalog-count');
    el.sectionTitle = document.getElementById('section-title');
    el.paginationBox = document.getElementById('pagination-box');
    el.favCount = document.getElementById('fav-count');
    el.favCountMobile = document.querySelector('.fav-count-mobile');
    el.mobileDropdownBtn = document.getElementById('mobile-dropdown-btn');
    el.mobileDropdownMenu = document.getElementById('mobile-dropdown-menu');

    el.playerModal = document.getElementById('player-modal');
    el.modalCloseBtn = document.getElementById('modal-close-btn');
    el.modalAnimeTitle = document.getElementById('modal-anime-title');
    el.modalScore = document.getElementById('modal-score');
    el.modalTypeBadge = document.getElementById('modal-type-badge');
    el.modalStatusBadge = document.getElementById('modal-status-badge');
    el.modalPoster = document.getElementById('modal-poster');
    el.modalOverview = document.getElementById('modal-overview');
    el.modalGenreBadges = document.getElementById('modal-genre-badges');
    el.modalFavBtn = document.getElementById('modal-fav-btn');
    el.streamIframe = document.getElementById('stream-iframe');
    el.playerLoader = document.getElementById('player-loader');
    el.serverButtons = document.querySelectorAll('.server-btn');
    el.episodeGrid = document.getElementById('episode-grid');
    el.episodesBar = document.getElementById('episodes-bar');

    el.seasonDropdownTrigger = document.getElementById('season-dropdown-trigger');
    el.seasonDropdownMenu = document.getElementById('season-dropdown-menu');
    el.selectedSeasonLabel = document.getElementById('selected-season-label');

    el.autoNextToggle = document.getElementById('auto-next-toggle');
    el.autoNextToast = document.getElementById('auto-next-toast');
    el.nextEpLabel = document.getElementById('next-ep-label');
    el.countdownTimer = document.getElementById('countdown-timer');
    el.cancelAutoNext = document.getElementById('cancel-auto-next');
    el.playNextNow = document.getElementById('play-next-now');

    el.heroBg = document.getElementById('hero-bg');
    el.heroTitle = document.getElementById('hero-title');
    el.heroSynopsis = document.getElementById('hero-synopsis');
    el.heroRating = document.getElementById('hero-rating');
    el.heroYear = document.getElementById('hero-year');
    el.heroStatus = document.getElementById('hero-status');
    el.heroGenre = document.getElementById('hero-genre');
    el.heroPlayBtn = document.getElementById('hero-play-btn');
    el.heroInfoBtn = document.getElementById('hero-info-btn');
    el.heroFavBtn = document.getElementById('hero-fav-btn');
}

function bindEvents() {
    el.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        el.clearSearch.classList.toggle('hidden', !state.searchQuery);
        state.currentPage = 1;
        filterAndRender();

        if (state.searchQuery.length >= 3) {
            searchTMDBLive(state.searchQuery);
        }
    });

    el.clearSearch.addEventListener('click', () => {
        el.searchInput.value = '';
        state.searchQuery = '';
        el.clearSearch.classList.add('hidden');
        state.currentPage = 1;
        filterAndRender();
    });

    el.mobileDropdownBtn.addEventListener('click', () => {
        el.mobileDropdownMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            state.currentGenre = btn.dataset.genre;
            state.currentPage = 1;
            filterAndRender();
        });
    });

    document.querySelectorAll('.day-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.day-chip').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            state.currentDay = btn.dataset.day;
            if (state.currentTab === 'schedule') {
                filterAndRender();
            }
        });
    });

    el.serverButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const server = btn.dataset.server;
            if (server) switchServer(server);
        });
    });

    el.modalCloseBtn.addEventListener('click', closeModal);
    el.playerModal.addEventListener('click', (e) => {
        if (e.target === el.playerModal) closeModal();
    });

    el.seasonDropdownTrigger.addEventListener('click', () => {
        el.seasonDropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#custom-season-dropdown')) {
            el.seasonDropdownMenu.classList.add('hidden');
        }
        if (!e.target.closest('.mobile-dropdown-btn') && !e.target.closest('.mobile-dropdown-menu')) {
            el.mobileDropdownMenu.classList.add('hidden');
        }
    });

    el.autoNextToggle.addEventListener('click', () => {
        state.autoNext = !state.autoNext;
        el.autoNextToggle.classList.toggle('active', state.autoNext);
        localStorage.setItem('sameha_auto_next', state.autoNext);
    });

    el.cancelAutoNext.addEventListener('click', () => {
        clearInterval(state.autoNextTimer);
        el.autoNextToast.classList.add('hidden');
    });

    el.playNextNow.addEventListener('click', () => {
        clearInterval(state.autoNextTimer);
        el.autoNextToast.classList.add('hidden');
        playEpisode(state.currentEpisode + 1);
    });
}

async function loadAnimeCatalog() {
    try {
        const resp = await fetch('./anime_catalog.json?t=' + Date.now());
        if (resp.ok) {
            const data = await resp.json();
            if (Array.isArray(data) && data.length > 0) {
                state.animeList = data;
            }
        }
    } catch (e) {
        console.warn('Catalog load note:', e);
    }

    setupHeroSpotlight();
    filterAndRender();
    autoSyncLatestAnime();
}

function setupHeroSpotlight() {
    const spotlight = state.animeList[0];
    if (!spotlight) return;

    el.heroBg.style.backgroundImage = 'url("' + (spotlight.backdrop_path || spotlight.poster_path) + '")';
    el.heroTitle.textContent = spotlight.title;
    el.heroSynopsis.textContent = spotlight.overview || 'Sinopsis anime petualangan terbaik musim ini.';
    el.heroRating.textContent = spotlight.vote_average || '8.8';
    el.heroYear.textContent = spotlight.release_date || '2026';
    el.heroStatus.textContent = spotlight.status || 'Ongoing';
    el.heroGenre.textContent = (spotlight.genres || ['Action', 'Fantasy']).join(' • ');

    el.heroPlayBtn.onclick = () => openPlayerModal(spotlight);
    el.heroInfoBtn.onclick = () => openPlayerModal(spotlight);
    el.heroFavBtn.onclick = () => toggleFavorite(spotlight);
}

function filterAndRender() {
    let list = [...state.animeList];

    if (state.currentTab === 'ongoing') {
        list = list.filter(a => a.status === 'Ongoing' && a.type === 'series');
        el.sectionTitle.innerHTML = '<i class="fa-solid fa-bolt-lightning text-neon"></i> Anime Ongoing Musim Ini (Update Setiap Hari)';
    } else if (state.currentTab === 'completed') {
        list = list.filter(a => a.status === 'Completed' || a.type === 'series');
        el.sectionTitle.innerHTML = '<i class="fa-solid fa-circle-check text-neon"></i> Anime Tamat / Complete Batch';
    } else if (state.currentTab === 'movies') {
        list = list.filter(a => a.type === 'movie');
        el.sectionTitle.innerHTML = '<i class="fa-solid fa-film text-neon"></i> Anime Movie Sub Indo Full HD';
    } else if (state.currentTab === 'watchlist') {
        list = state.watchlist;
        el.sectionTitle.innerHTML = '<i class="fa-solid fa-heart text-neon"></i> Koleksi Anime Favorit Saya (' + list.length + ')';
    } else if (state.currentTab === 'schedule') {
        el.sectionTitle.innerHTML = '<i class="fa-solid fa-calendar-days text-neon"></i> Jadwal Rilis Anime Hari ' + state.currentDay.toUpperCase();
    } else {
        el.sectionTitle.innerHTML = '<i class="fa-solid fa-fire text-neon"></i> Rekomendasi & Update Anime Terbaru';
    }

    if (state.currentGenre !== 'all') {
        list = list.filter(a => (a.genres || []).includes(state.currentGenre) || (a.overview || '').toLowerCase().includes(state.currentGenre.toLowerCase()));
    }

    if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        list = list.filter(a => a.title.toLowerCase().includes(q) || (a.original_title || '').toLowerCase().includes(q) || (a.overview || '').toLowerCase().includes(q));
    }

    state.filteredList = list;
    el.catalogCount.textContent = list.length + ' Judul Ditemukan';

    renderCards();
    renderPagination();
}

function renderCards() {
    if (state.filteredList.length === 0) {
        el.animeGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;"><i class="fa-solid fa-ghost" style="font-size: 3rem; color: var(--neon-pink); margin-bottom: 1rem;"></i><h3 style="color: #fff; font-size: 1.3rem;">Tidak Ada Anime Ditemukan</h3><p style="color: var(--text-muted); margin-top: 0.5rem;">Coba cari dengan kata kunci lain atau pilih genre berbeda.</p></div>';
        return;
    }

    const start = (state.currentPage - 1) * state.itemsPerPage;
    const paginated = state.filteredList.slice(start, start + state.itemsPerPage);

    el.animeGrid.innerHTML = paginated.map(anime => {
        const typeLabel = anime.type === 'movie' ? 'MOVIE' : (anime.status === 'Ongoing' ? 'ONGOING' : 'BATCH');
        const genreLabel = anime.genres && anime.genres.length > 0 ? anime.genres[0] : 'Anime';
        return '<div class="anime-card" onclick="openPlayerModalById(' + anime.id + ')">' +
            '<div class="card-poster-wrap">' +
                '<img src="' + anime.poster_path + '" alt="' + anime.title + '" class="card-poster" loading="lazy">' +
                '<div class="card-badges-top">' +
                    '<span class="card-type-tag">' + typeLabel + '</span>' +
                    '<span class="card-rating-tag"><i class="fa-solid fa-star"></i> ' + (anime.vote_average || '8.5') + '</span>' +
                '</div>' +
                '<div class="card-play-overlay">' +
                    '<div class="play-circle-icon"><i class="fa-solid fa-play"></i></div>' +
                '</div>' +
            '</div>' +
            '<div class="card-content">' +
                '<h3 class="card-title" title="' + anime.title + '">' + anime.title + '</h3>' +
                '<div class="card-info-row">' +
                    '<span>' + (anime.release_date || '2026') + '</span>' +
                    '<span class="card-status">' + genreLabel + '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(state.filteredList.length / state.itemsPerPage);
    if (totalPages <= 1) {
        el.paginationBox.innerHTML = '';
        return;
    }

    let buttons = '';
    const cur = state.currentPage;

    if (cur > 1) {
        buttons += '<button class="page-btn" onclick="changePage(' + (cur - 1) + ')"><i class="fa-solid fa-chevron-left"></i></button>';
    }

    for (let i = Math.max(1, cur - 2); i <= Math.min(totalPages, cur + 2); i++) {
        buttons += '<button class="page-btn ' + (i === cur ? 'active' : '') + '" onclick="changePage(' + i + ')">' + i + '</button>';
    }

    if (cur < totalPages) {
        buttons += '<button class="page-btn" onclick="changePage(' + (cur + 1) + ')"><i class="fa-solid fa-chevron-right"></i></button>';
    }

    el.paginationBox.innerHTML = buttons;
}

function changePage(p) {
    state.currentPage = p;
    renderCards();
    renderPagination();
    window.scrollTo({ top: document.querySelector('.content-section').offsetTop - 100, behavior: 'smooth' });
}

window.navigateTab = function(tab) {
    state.currentTab = tab;
    state.currentPage = 1;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tab));
    document.querySelectorAll('.mobile-nav-link').forEach(l => l.classList.remove('active'));
    el.mobileDropdownMenu.classList.add('hidden');
    filterAndRender();
};

window.openPlayerModalById = function(id) {
    const anime = state.animeList.find(a => a.id === id);
    if (anime) openPlayerModal(anime);
};

async function openPlayerModal(anime) {
    state.activeAnime = anime;
    state.currentSeason = 1;
    state.currentEpisode = 1;

    el.modalAnimeTitle.textContent = anime.title;
    el.modalScore.textContent = anime.vote_average || '8.5';
    el.modalTypeBadge.textContent = anime.type === 'movie' ? 'Anime Movie HD' : 'TV Series';
    el.modalStatusBadge.textContent = anime.status || 'Ongoing';
    el.modalPoster.src = anime.poster_path;
    el.modalOverview.textContent = anime.overview || 'Sinopsis anime belum tersedia.';

    el.modalGenreBadges.innerHTML = (anime.genres || ['Action', 'Fantasy', 'Animation']).map(g => '<span class="genre-pill">' + g + '</span>').join('');

    updateModalFavButton(anime);

    if (anime.type === 'movie') {
        el.episodesBar.classList.add('hidden');
    } else {
        el.episodesBar.classList.remove('hidden');
        await fetchSeasonsAndEpisodes(anime);
    }

    loadStreamVideo();
    el.playerModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

async function fetchSeasonsAndEpisodes(anime) {
    let totalSeasons = 1;
    let episodesCount = anime.episodes_total || (anime.direct_embeds ? Object.keys(anime.direct_embeds).length / 2 : 12);

    if (anime.id < 900000) {
        try {
            const resp = await fetch(CONFIG.TMDB_BASE_URL + '/tv/' + anime.id + '?api_key=' + CONFIG.TMDB_API_KEY + '&language=id-ID');
            if (resp.ok) {
                const data = await resp.json();
                totalSeasons = data.number_of_seasons || 1;
                const s1 = (data.seasons || []).find(s => s.season_number === 1);
                episodesCount = s1 ? s1.episode_count || 12 : (data.number_of_episodes || 12);
                anime.seasons_data = data.seasons || [];
            }
        } catch (e) {
            console.warn('Using fallback episode count:', e);
        }
    }

    el.selectedSeasonLabel.textContent = 'Season ' + state.currentSeason;
    el.seasonDropdownMenu.innerHTML = Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => {
        return '<button class="dropdown-item ' + (s === state.currentSeason ? 'active' : '') + '" onclick="selectSeason(' + s + ')">Season ' + s + '</button>';
    }).join('');

    renderEpisodeGrid(episodesCount);
}

window.selectSeason = async function(seasonNum) {
    state.currentSeason = seasonNum;
    state.currentEpisode = 1;
    el.selectedSeasonLabel.textContent = 'Season ' + seasonNum;
    el.seasonDropdownMenu.classList.add('hidden');

    let epCount = 12;
    if (state.activeAnime && state.activeAnime.seasons_data) {
        const targetS = state.activeAnime.seasons_data.find(s => s.season_number === seasonNum);
        if (targetS) epCount = targetS.episode_count || 12;
    }

    renderEpisodeGrid(epCount);
    loadStreamVideo();
};

function renderEpisodeGrid(count) {
    count = Math.max(1, count || 12);
    el.episodeGrid.innerHTML = Array.from({ length: count }, (_, i) => i + 1).map(ep => {
        return '<button class="ep-btn ' + (ep === state.currentEpisode ? 'active' : '') + '" onclick="playEpisode(' + ep + ')">Ep ' + ep + '</button>';
    }).join('');
}

window.playEpisode = function(ep) {
    state.currentEpisode = ep;
    document.querySelectorAll('.ep-btn').forEach(b => {
        b.classList.toggle('active', b.textContent.trim() === ('Ep ' + ep));
    });
    loadStreamVideo();
};

function switchServer(serverKey) {
    state.activeServer = serverKey;
    el.serverButtons.forEach(b => b.classList.toggle('active', b.dataset.server === serverKey));
    loadStreamVideo();
}

function loadStreamVideo() {
    if (!state.activeAnime) return;

    el.playerLoader.classList.remove('hidden');
    const portalBtn = document.getElementById('portal-watch-btn');
    if (portalBtn) portalBtn.classList.add('hidden');
    el.streamIframe.classList.remove('hidden');

    const providerFn = SERVERS[state.activeServer] || SERVERS['multiembed'];
    const streamUrl = providerFn(state.activeAnime, state.currentSeason, state.currentEpisode);

    el.streamIframe.src = streamUrl;
    el.streamIframe.onload = () => {
        el.playerLoader.classList.add('hidden');
    };
    setTimeout(() => el.playerLoader.classList.add('hidden'), 3000);
}

function closeModal() {
    el.playerModal.classList.add('hidden');
    el.streamIframe.src = '';
    document.body.style.overflow = 'auto';
    clearInterval(state.autoNextTimer);
    el.autoNextToast.classList.add('hidden');
}

function toggleFavorite(anime) {
    const idx = state.watchlist.findIndex(a => a.id === anime.id);
    if (idx >= 0) {
        state.watchlist.splice(idx, 1);
    } else {
        state.watchlist.unshift(anime);
    }
    localStorage.setItem('sameha_watchlist', JSON.stringify(state.watchlist));
    updateFavCount();
    updateModalFavButton(anime);
    if (state.currentTab === 'watchlist') filterAndRender();
}

function updateFavCount() {
    const c = state.watchlist.length;
    if (el.favCount) el.favCount.textContent = c;
    if (el.favCountMobile) el.favCountMobile.textContent = c;
}

function updateModalFavButton(anime) {
    const isFav = state.watchlist.some(a => a.id === anime.id);
    el.modalFavBtn.innerHTML = isFav 
        ? '<i class="fa-solid fa-heart" style="color: var(--neon-pink);"></i> Hapus Favorit' 
        : '<i class="fa-regular fa-heart"></i> Tambah Favorit';
    el.modalFavBtn.onclick = () => toggleFavorite(anime);
}

async function searchTMDBLive(query) {
    try {
        const resp = await fetch(CONFIG.TMDB_BASE_URL + '/search/multi?api_key=' + CONFIG.TMDB_API_KEY + '&query=' + encodeURIComponent(query) + '&language=id-ID');
        if (!resp.ok) return;
        const data = await resp.json();
        if (!data.results) return;

        const existingIds = new Set(state.animeList.map(a => a.id));
        let added = 0;

        data.results.forEach(it => {
            if (!it || !it.id || existingIds.has(it.id)) return;
            if (!it.poster_path) return;
            const isAnim = (it.genre_ids || []).includes(16) || it.original_language === 'ja';
            if (!isAnim) return;

            const isMovie = it.media_type === 'movie' || Boolean(it.title);
            const anime = {
                id: it.id,
                title: it.title || it.name || 'Anime',
                original_title: it.original_title || it.original_name || '',
                type: isMovie ? 'movie' : 'series',
                status: 'Ongoing',
                release_date: (it.release_date || it.first_air_date || '2026').substring(0, 4),
                vote_average: it.vote_average ? Number(it.vote_average.toFixed(1)) : 8.0,
                overview: it.overview || 'Sinopsis anime...',
                poster_path: CONFIG.IMAGE_BASE_URL + it.poster_path,
                backdrop_path: it.backdrop_path ? (CONFIG.BACKDROP_BASE_URL + it.backdrop_path) : (CONFIG.IMAGE_BASE_URL + it.poster_path),
                genres: ['Anime', 'Action']
            };

            state.animeList.unshift(anime);
            existingIds.add(it.id);
            added++;
        });

        if (added > 0) filterAndRender();
    } catch (e) {
        console.warn('Live TMDB Search error:', e);
    }
}

async function autoSyncLatestAnime() {
    try {
        const resp = await fetch(CONFIG.TMDB_BASE_URL + '/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&api_key=' + CONFIG.TMDB_API_KEY + '&language=id-ID');
        if (!resp.ok) return;
        const data = await resp.json();
        if (!data.results) return;

        const existingIds = new Set(state.animeList.map(a => a.id));
        data.results.forEach(it => {
            if (!it || !it.id || existingIds.has(it.id) || !it.poster_path) return;
            state.animeList.push({
                id: it.id,
                title: it.name || 'Anime',
                type: 'series',
                status: 'Ongoing',
                release_date: (it.first_air_date || '2026').substring(0, 4),
                vote_average: it.vote_average ? Number(it.vote_average.toFixed(1)) : 8.0,
                overview: it.overview || 'Sinopsis anime...',
                poster_path: CONFIG.IMAGE_BASE_URL + it.poster_path,
                backdrop_path: it.backdrop_path ? (CONFIG.BACKDROP_BASE_URL + it.backdrop_path) : (CONFIG.IMAGE_BASE_URL + it.poster_path),
                genres: ['Anime', 'Action']
            });
            existingIds.add(it.id);
        });
        filterAndRender();
    } catch (e) {
        console.warn('Background auto sync notice:', e);
    }
}
