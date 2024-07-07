/*

=====================================================
=====================================================


  ███████╗██╗  ██╗██╗  ██╗██╗  ██╗██╗   ██╗███████╗
  ██╔════╝╚██╗██╔╝██║  ██║╚██╗██╔╝╚██╗ ██╔╝╚══███╔╝
  █████╗   ╚███╔╝ ███████║ ╚███╔╝  ╚████╔╝   ███╔╝
  ██╔══╝   ██╔██╗ ██╔══██║ ██╔██╗   ╚██╔╝   ███╔╝
  ██║     ██╔╝ ██╗██║  ██║██╔╝ ██╗   ██║   ███████╗
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝


=====================================================
=====================================================

*/

import open, { apps } from "open";
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import chalk from "chalk";

dotenv.config();

const {
  PORT,
  USER,
  ID,
  CHANNEL,
  CLIENT_ID,
  CLIENT_SECRET,
  OAUTH,
  PRIME,
  DELAY,
  BASE_URI,
  REDIRECT_URI,
  AUTH_URI,
  POST
} = process.env;

const server = express();

const customColors = []; // your custom colors, if you have Twitch Prime or Turbo

const defaultColors = [
  "blue",
  "blue_violet",
	"cadet_blue",
	"chocolate",
	"coral",
	"dodger_blue",
	"firebrick",
	"golden_rod",
	"green",
	"hot_pink",
	"orange_red",
	"red",
	"sea_green",
	"spring_green",
	"yellow_green",
]; // available colors for non-Turbo/Prime users

await open(`${BASE_URI}/auth/twitch`);

server.get("/", async (req, res) => {
  res.send('Welcome to TwitchColorChanger');
})

server.get('/auth/twitch', (req, res) => {
  const authUrl = `${AUTH_URI}/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:manage:chat_color`;
  res.redirect(authUrl);
});

server.get('/auth/twitch/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const r = await axios.post(`${AUTH_URI}/token`, null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      },
    });

    const { access_token } = r.data;
    authTwitch(access_token);

    res.send('🟢🟢🟢');
  } catch (e) {
    console.error('🔴🔴🔴', e.message);
    res.status(500).send('🔴🔴🔴');
  }
});

server.get("*", async (req, res) => {
  res.send("Error");
})

const getColor = () => {
	if (customColors && customColors.length > 0) {
		return customColors[Math.floor(Math.random() * customColors.length)];
	} else if (PRIME) {
		return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
	} else {
		return defaultColors[Math.floor(Math.random() * defaultColors.length)];
	}
};

const authTwitch = async (accessToken) => {
  try {
    setInterval(() => TwitchColorChanger(accessToken), DELAY);
  } catch (e) {
    console.error('🔴🔴🔴 Error while receiving Access Token:', e.message);
    throw e;
  }
};

const changeColor = async (color, token) => {
  try {
    const r = await axios.put(
      `${POST}?user_id=${ID}&color=${encodeURIComponent(color)}`,
      { color },
      {
        headers: {
          'Client-ID': CLIENT_ID,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (e) {
      console.error('🔴🔴🔴 Error when changing color:', e.response.data);
      throw e;
  }
};


const TwitchColorChanger = async (token) => {
  const color = getColor();

  try {
      await changeColor(color, token);
      console.info(chalk.hex(color)(`Color changed to: ${color}`));
  } catch (e) {
      console.error('🔴🔴🔴 Error when changing color:', e);
  }
};

const showSettings = () => {
  console.log(chalk.red(`==================Settings==================`));
  console.log(chalk.hex(`#00ffec`)("---user: " + `${USER}`));
  console.log(chalk.hex(`#00ffec`)("-----id: " + `${ID}`));
  console.log(chalk.hex(`#00ffec`)("-client: " + `${CLIENT_ID}`));
  console.log(chalk.hex(`#00ffec`)("--token: " + `${OAUTH}`));
  console.log(chalk.hex(`#00ffec`)("--delay: " + `${DELAY}`));
  console.log(chalk.hex(`#00ffec`)("--prime: " + `${PRIME}`));
  console.log(chalk.red(`==================Settings==================`));
};

showSettings();

server.listen(PORT, () => {
  console.debug(`server run on port: ${PORT}`);
});
