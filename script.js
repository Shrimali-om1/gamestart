const API_KEY = 'a5932c5b95e54baeb85a6cec8a2ab527';
let currentPage = 1;
const pageSize = 50; // ✅ Increased page size to 50

const gamesContainer = document.getElementById('games');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageNumber = document.getElementById('page-number');

async function fetchGames(page) {
    try {
        let allGames = [];
        let nextPage = page;
        let fetchedGames = 0;

        // ✅ Keep fetching until we get at least 50 games
        while (fetchedGames < 50) {
            const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=${pageSize}&page=${nextPage}`);
            const data = await response.json();
            
            if (data.results.length === 0) break; // Stop if no more games

            allGames = [...allGames, ...data.results];
            fetchedGames = allGames.length;
            nextPage++; // Move to the next page if needed
        }

        // Fetch trailers for each game, wait for all responses
        const gamesWithTrailers = await Promise.all(
            allGames.slice(0, 50).map(async (game) => {
                const trailerResponse = await fetch(`https://api.rawg.io/api/games/${game.id}/movies?key=${API_KEY}`);
                const trailerData = await trailerResponse.json();
                return { ...game, hasTrailer: trailerData.results.length > 0 };
            })
        );

        // ✅ Sort: Games with trailers first
        gamesWithTrailers.sort((a, b) => b.hasTrailer - a.hasTrailer);

        // Clear previous content before updating UI
        gamesContainer.innerHTML = '';

        // Add sorted games to UI
        gamesWithTrailers.forEach(game => {
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

        // ✅ Scroll to top when page changes
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
