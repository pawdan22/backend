# VMPK Discord Auth Backend

Backend do logowania przez Discord i sprawdzania roli `vmpk driver`.

## Zmienne środowiskowe
Skopiuj `.env.example` do `.env` lokalnie albo ustaw te wartości na hostingu.

- `DISCORD_CLIENT_ID` - z Discord Developer Portal
- `DISCORD_CLIENT_SECRET` - z Discord Developer Portal
- `DISCORD_REDIRECT_URI` - adres callback backendu, np. `https://vmpk-auth.onrender.com/auth/discord/callback`
- `FRONTEND_URL` - adres panelu na GitHub Pages, np. `https://twojlogin.github.io/twojerepo/`
- `SESSION_SECRET` - długi losowy tekst
- `GUILD_ID` - ID serwera Discord
- `DRIVER_ROLE_ID` - ID roli kierowcy
- `ADMIN_DISCORD_ID` - ID admina

## Uruchomienie lokalne
```bash
npm install
npm start
```

## Discord Developer Portal
W aplikacji Discord dodaj Redirect URI dokładnie taki sam jak `DISCORD_REDIRECT_URI`.

## Frontend
W pliku panelu podmień:
```js
const AUTH_API_URL = 'https://TWOJ-BACKEND.onrender.com';
```
na adres swojego backendu.
