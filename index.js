const express = require('express');

const postsRoutes = require('./postRoutes.js');

const server = express();
server.use(express.json());

server.use('/api/posts', postsRoutes );

server.use('/', (req, res) => res.send('API up and running!'));
server.listen(8000, () => console.log('API running on port 8000'));

