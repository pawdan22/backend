import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  FRONTEND_URL,
  SESSION_SECRET,
  GUILD_ID = '1131905853574881290',
  DRIVER_ROLE_ID = '1485285606761300078',
  ADMIN_DISCORD_ID = '687348708181934122',
  PORT = 3000
} = process.env;

const required = {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  FRONTEND_URL,
  SESSION_SECRET
};

for (const [key, value] of Object.entries(required)) {
  if (!value) {
    console.error(`Brakuje zmiennej środowiskowej: ${key}`);
    process.exit(1);
  }
}

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

function redirectWithError(message) {
  return `${FRONTEND_URL}#error=${encodeURIComponent(message)}`;
}

app.get('/', (_req, res) => {
  res.send('VMPK Discord Auth działa.');
});

app.get('/auth/discord', (_req, res) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds.members.read',
    prompt: 'none'
  });

  res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
});

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect(redirectWithError('Discord nie zwrócił kodu logowania.'));

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI
      })
    });

    if (!tokenResponse.ok) {
      const text = await tokenResponse.text();
      console.error('Token error:', text);
      return res.redirect(redirectWithError('Nie udało się zalogować przez Discord.'));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userResponse.ok) {
      return res.redirect(redirectWithError('Nie udało się pobrać profilu Discord.'));
    }

    const user = await userResponse.json();

    const memberResponse = await fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!memberResponse.ok) {
      return res.redirect(redirectWithError('Nie jesteś na serwerze Discord VMPK albo nie można sprawdzić roli.'));
    }

    const member = await memberResponse.json();
    const roles = member.roles || [];
    const isDriver = roles.includes(DRIVER_ROLE_ID);
    const isAdmin = user.id === ADMIN_DISCORD_ID;

    if (!isDriver && !isAdmin) {
      return res.redirect(redirectWithError('Nie masz wymaganej roli vmpk driver.'));
    }

    const displayName = member.nick || user.global_name || user.username;

    const appToken = jwt.sign({
      id: user.id,
      username: displayName,
      discordUsername: user.username,
      avatar: user.avatar,
      isAdmin,
      isDriver
    }, SESSION_SECRET, { expiresIn: '12h' });

    res.redirect(`${FRONTEND_URL}#token=${encodeURIComponent(appToken)}`);
  } catch (err) {
    console.error(err);
    res.redirect(redirectWithError('Wystąpił błąd backendu podczas logowania.'));
  }
});

app.get('/api/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Brak tokenu.' });

  try {
    const user = jwt.verify(token, SESSION_SECRET);
    res.json({
      id: user.id,
      username: user.username,
      discordUsername: user.discordUsername,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isDriver: user.isDriver
    });
  } catch (_err) {
    res.status(401).json({ error: 'Token wygasł lub jest niepoprawny.' });
  }
});

app.listen(PORT, () => {
  console.log(`VMPK Discord Auth działa na porcie ${PORT}`);
});
