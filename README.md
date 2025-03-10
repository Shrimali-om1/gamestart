# GameStore Website

A simple game store website that displays game details, trailers, screenshots, and store links using the **RAWG.io API**. The website also features pagination for browsing games efficiently.

## Features
- Display a list of games fetched from the RAWG.io API
- View detailed game information (title, description, release date, platforms, Metacritic score, publishers, developers, genres, and ESRB rating)
- View game media (cover image, trailers, and screenshots)
- Check available stores and pricing
- Navigate through games using a pagination system
- Automatically prioritize games with trailers first
- Responsive design for both desktop and mobile (optimized for CMF by Nothing phone)

## Tech Stack
- **HTML**: Structure of the website
- **CSS**: Styling, including responsive design
- **JavaScript (ES6+)**: Fetching API data, handling UI interactions
- **RAWG.io API**: Fetching game data, trailers, and store information

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/gamestore.git
   cd gamestore
   ```

2. Open `index.html` in your browser or run a local server:
   ```bash
   npx live-server
   ```

3. Replace the **RAWG.io API key** in `details.js` and `script.js`:
   ```js
   const API_KEY = 'your_rawg_api_key';
   ```

## How It Works
- **Homepage (`index.html`)**: Displays a list of games with pagination.
- **Game Details (`details.html`)**: Shows detailed information about a selected game.
- **Pagination**: Click next/previous buttons to load more games (auto-scroll to top).
- **Sorting**: Games with trailers are prioritized on the first page.

## Screenshots
![Homepage Preview](screenshots/homepage.png)
![Game Details Preview](screenshots/game_details.png)

## Future Improvements
- Add user authentication for wishlist & favorites
- Implement a search feature
- Improve UI/UX with better animations

## License
This project is open-source and available under the MIT License.
