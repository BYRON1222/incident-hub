const { createApp } = require('./app');

const port = process.env.PORT || 3000;
createApp().listen(port, () => console.log(`IT Incident Hub API escuchando en :${port}`));
