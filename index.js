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

const user = 'fxhxyz'; // your twitch username
const oauth = ''; // your twitch OAuth token https://twitchapps.com/tmi/

const delay = 3000; // Delay for changing color in chat (recommend min min: 3s/3000ms)
const colors = [
  '#FF0000',
  '#008000',
  '#0000FF',
  '#D2691E',
  '#FF7F50',
  '#9ACD32',
  '#FF4500',
  '#2E8B57',
  '#DAA520',
  '#D2691E',
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
  } else {
    return colors[Math.floor(Math.random() * colors.length)];
  }
};

const TwitchColorChanger = () => {
  const color = getColor();
  ws.send(`PRIVMSG #${user} :/color ${color}`);
};

ws.on('open', () => {
  ws.send(`PASS ${oauth}`);
  ws.send(`NICK ${user}`);
  ws.send(`JOIN #${user}`);
});

setInterval(() => {
  TwitchColorChanger();
}, delay);
