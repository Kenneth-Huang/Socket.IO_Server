const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const PORT = process.env.PORT|| 8008;
const index = require('./routes/index');

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

let interval;
io.on("connection", socket => {
	console.log("New client connected");
	if(interval){
		clearInterval(interval);
	} 
	interval = setInterval(
	  () => getApiAndEmit(socket),
	  10000
	);
	socket.on("disconnect", () => console.log("Client disconnected"));
  });

const API_URL =
	'https://api.apixu.com/v1/forecast.json?key=6e4474fdc7e548ce8ba115109190603&days=7&q=Brisbane';

const city = 'Brisbane';
const getApiAndEmit = async socket =>{
	try {
		const res = await axios.get(API_URL);
		console.log('res:'+JSON.stringify(res.data.current));
		socket.emit('FromAPI', res.data.current);
	}catch(error){
		console.error(`Error:${error}`);
	}
};

server.listen(PORT, ()=> console.log(`Listen on port:${PORT}`));

