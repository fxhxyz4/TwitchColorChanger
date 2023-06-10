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

import colors from 'colors';
import WebSocket from 'ws';

const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

const user = 'bxffz_'; // your twitch username
const oauth = 'oauth:'; // your twitch OAuth token https://twitchapps.com/tmi/

const delay = 8000; // Delay for changing color in chat (recommend min delay: 5s/5000ms)
const customColors = []; // your custom colors

const defaultColors = [
  '#FF0000',
  '#008000',
  '#0000FF',
  '#D2691E',
  '#FF7F50',
  '#9ACD32',
  '#FF4500',
  '#2E8B57',
  '#DAA520',
  '#5F9EA0',
  '#1E90FF',
  '#FF69B4',
  '#8A2BE2',
  '#00FF7F',
]; // available colors for non-Turbo/Prime users
const prime = false; // if you have Twitch Prime or Turbo, set to true

const getColor = () => {
  if (prime) {
    return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
  } else if (customColors && customColors.length > 0) {
    return customColors[Math.floor(Math.random() * customColors.length)];
  } else {
    return defaultColors[Math.floor(Math.random() * defaultColors.length)];
  }
};

const TwitchColorChanger = () => {
  const color = getColor();

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(`PRIVMSG #${user} :/color ${color}`);
    console.info(`new color: ${color}`);
  }
};

ws.on('open', () => {
  console.info(`ws connected`.green);

  ws.send(`PASS ${oauth}`);
  ws.send(`NICK ${user}`);
  ws.send(`JOIN #${user}`);
});

const showSettings = () => {
  console.log(`==================Settings==================`.red);
  console.log('--user: '.red + `${user}`.magenta);
  console.log('-token: '.red + `${oauth}`.magenta);
  console.log('-delay: '.red + `${delay}`.magenta);
  console.log('-prime: '.red + `${prime}`.magenta);
  console.log(`==================Settings==================`.red);
};

showSettings();

setInterval(() => {
  TwitchColorChanger();
}, delay);
