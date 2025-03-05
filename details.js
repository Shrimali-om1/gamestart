document.addEventListener('DOMContentLoaded', fetchGameDetails);

const API_KEY = 'a5932c5b95e54baeb85a6cec8a2ab527'; // Replace with your RAWG.io API key

async function fetchGameDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    if (!gameId) return;

    try {
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
        const game = await response.json();

        // ✅ Set basic details
        setElementTextContent('game-title', game.name);
        setElementTextContent('game-description', game.description_raw || 'No description available');
        setElementTextContent('release-date', `Release Date: ${game.released || 'N/A'}`);
        setElementTextContent('platforms', `Platforms: ${game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'N/A'}`);
        setElementTextContent('metacritic', `Metacritic Score: ${game.metacritic || 'N/A'}`);
        setElementTextContent('developer', `Developer: ${game.developers.map(d => d.name).join(', ') || 'N/A'}`);
        setElementTextContent('genres', `Genres: ${game.genres.map(g => g.name).join(', ') || 'N/A'}`);
        setElementTextContent('esrb-rating', `ESRB Rating: ${game.esrb_rating ? game.esrb_rating.name : 'N/A'}`);

        // ✅ Set game cover image
        const gameCoverElement = document.getElementById('game-cover');
        if (gameCoverElement) {
            gameCoverElement.src = game.background_image || '';
            gameCoverElement.alt = game.name;
        }

        // ✅ Fetch Trailers (Limit to 2)
        const trailersContainer = document.getElementById('trailer');
        if (trailersContainer) {
            const trailersResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=${API_KEY}`);
            const trailersData = await trailersResponse.json();
            
            trailersContainer.innerHTML = trailersData.results.length > 0
                ? trailersData.results.slice(0).map(trailer => `
                    <video class="trailer-video" controls>
                        <source src="${trailer.data.max}" type="video/mp4">
                    </video>
                `).join('')
                : '<p>No trailers available</p>';
        }

        // ✅ Fetch Screenshots
        const screenshotsContainer = document.getElementById('screenshots');
        if (screenshotsContainer) {
            const screenshotsResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`);
            const screenshotsData = await screenshotsResponse.json();
            
            screenshotsContainer.innerHTML = screenshotsData.results.length > 0
                ? screenshotsData.results.map(img => `<img src="${img.image}" class="screenshot">`).join('')
                : '<p>No screenshots available</p>';
        }

        // ✅ Fetch Store Links
        const storesContainer = document.getElementById('store-links');
        if (storesContainer) {
            const storesResponse = await fetch(`https://api.rawg.io/api/games/${gameId}/stores?key=${API_KEY}`);
            const storesData = await storesResponse.json();
            
            if (storesData.results && storesData.results.length > 0) {
                storesContainer.innerHTML = storesData.results.map(store => 
                    `<li><a href="${store.url}" target="_blank">Buy on ${getStoreName(store.store_id)}</a></li>`
                ).join('');
            } else {
                storesContainer.innerHTML = '<p>No stores available</p>';
            }
        }
        
        // Function to map store IDs to store names
        function getStoreName(storeId) {
            const storeNames = {
                1: "Steam",
                2: "Microsoft Store",
                3: "PlayStation Store",
                4: "App Store",
                5: "GOG",
                6: "Nintendo Store",
                7: "Xbox Store",
                8: "Google Play",
                9: "itch.io",
                10: "Amazon",
                11: "Epic Games Store",
            };
            return storeNames[storeId] || "Unknown Store";
        }
        
        

        // ✅ Fetch DLCs
        const dlcsContainer = document.getElementById('dlcs');
        if (dlcsContainer) {
            dlcsContainer.innerHTML = game.additions && game.additions.length > 0
                ? game.additions.map(dlc => `<p>${dlc.name}</p>`).join('')
                : '<p>No DLCs available</p>';
        }

        // ✅ Set Game Tags
        setElementTextContent('game-tags', `Tags: ${game.tags.map(tag => tag.name).join(', ') || 'N/A'}`);

        // ✅ Set External Links (Reddit & Twitter)
        setElementInnerHTML('reddit-link', game.reddit_url ? `<a href="${game.reddit_url}" target="_blank">Reddit Discussion</a>` : '<p>No Reddit link</p>');
        setElementInnerHTML('twitter-link', game.website ? `<a href="${game.website}" target="_blank">Official Website</a>` : '<p>No official website</p>');

    } catch (error) {
        console.error('Error fetching game details:', error);
    }
}

// ✅ Helper function to set text content safely
function setElementTextContent(elementId, textContent) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = textContent;
    } else {
        console.error(`Element with id "${elementId}" not found`);
    }
}

// ✅ Helper function to set inner HTML safely
function setElementInnerHTML(elementId, innerHTML) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = innerHTML;
    } else {
        console.error(`Element with id "${elementId}" not found`);
    }
}
