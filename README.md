# VMPK Discord Auth Backend

Wersja z obsługą roli `trainee` i wieloma adminami.

## Najważniejsze zmienne Render → Environment

```env
GUILD_ID=1131905853574881290
DRIVER_ROLE_ID=1485285606761300078
TRAINEE_ROLE_ID=TU_WKLEJ_ID_ROLI_TRAINEE
ADMIN_DISCORD_IDS=687348708181934122,DRUGI_ADMIN_ID,TRZECI_ADMIN_ID
```

`ADMIN_DISCORD_IDS` przyjmuje wiele ID po przecinku.

Logika dostępu:
- `driver` → normalny dostęp do panelu,
- `trainee` → może zalogować się i wejść do egzaminu po akceptacji podania w panelu dyspozytora,
- `admin` z `ADMIN_DISCORD_IDS` → dostęp do panelu dyspozytora.

Po zmianie plików zrób deploy na Renderze.
