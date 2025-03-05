const API_KEY = 'a5932c5b95e54baeb85a6cec8a2ab527';
let currentPage = 1;
const pageSize = 50;

const gamesContainer = document.getElementById('games');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageNumber = document.getElementById('page-number');

async function fetchGames(page) {
    try {
        gamesContainer.innerHTML = '<p>Loading games...</p>'; // Show loading text

        const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=${pageSize}&page=${page}`);
        const data = await response.json();
        let games = data.results;

        // ✅ Fetch trailers only for the first 10-15 games
        const gamesWithTrailers = await Promise.allSettled(
            games.slice(0, 15).map(async (game) => {
                const trailerResponse = await fetch(`https://api.rawg.io/api/games/${game.id}/movies?key=${API_KEY}`);
                const trailerData = await trailerResponse.json();
                return { ...game, hasTrailer: trailerData.results.length > 0 };
            })
        );

        // ✅ Merge fetched trailers with original games
        const finalGames = games.map(game => {
            const trailerData = gamesWithTrailers.find(g => g.status === "fulfilled" && g.value.id === game.id);
            return { ...game, hasTrailer: trailerData ? trailerData.value.hasTrailer : false };
        });

        // ✅ Sort: Games with trailers first
        finalGames.sort((a, b) => b.hasTrailer - a.hasTrailer);

        gamesContainer.innerHTML = ''; // Clear previous content

        finalGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            gameCard.innerHTML = `
                <img src="${game.background_image}" alt="${game.name}">
                <h3>${game.name}</h3>
                <p>${game.slug.replace(/-/g, ' ').toUpperCase()}</p>
                <p>Price: $${(Math.random() * (60 - 10) + 10).toFixed(2)}</p>
                ${game.hasTrailer ? '<span class="trailer-badge">🎬 Trailer Available</span>' : ''}
            `;
            gameCard.addEventListener('click', () => {
                window.location.href = `details.html?id=${game.id}`;
            });
            gamesContainer.appendChild(gameCard);
        });

        // ✅ Update pagination UI
        pageNumber.textContent = `Page ${page}`;
        prevBtn.style.display = page === 1 ? 'none' : 'inline-block';

        // ✅ Scroll to top smoothly when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// ✅ Pagination Event Listeners
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchGames(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchGames(currentPage);
});

// ✅ Load games on page load
document.addEventListener('DOMContentLoaded', () => fetchGames(currentPage));
