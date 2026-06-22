# VMPK Discord Auth Backend — bez wymaganej roli trainee

Ta wersja nie wymaga roli `trainee` do przejścia do egzaminu.

Backend:
- loguje przez Discord,
- sprawdza, czy użytkownik jest na serwerze Discord VMPK,
- sprawdza rolę `vmpk driver` dla normalnego dostępu do panelu,
- sprawdza adminów z `ADMIN_DISCORD_IDS`,
- nie blokuje kandydatów bez roli trainee — panel HTML sam sprawdza zaakceptowane podanie po nicku.

Zmienne Render:

```env
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_REDIRECT_URI=https://twoj-backend.onrender.com/auth/discord/callback
DISCORD_BOT_TOKEN=... # może zostać, ale ta wersja go nie używa
FRONTEND_URL=https://vmpk-drobin.pl
SESSION_SECRET=dlugi_losowy_tekst
GUILD_ID=1131905853574881290
DRIVER_ROLE_ID=1485285606761300078
ADMIN_DISCORD_IDS=687348708181934122,DRUGI_ADMIN_ID,TRZECI_ADMIN_ID
```

`TRAINEE_ROLE_ID` nie jest już wymagane.
