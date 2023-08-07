const express = require('express')
const TourOfHeroesRoutes = require('./routes/TourOfHeroesRoutes');
const app = express()
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');

var corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    optionsSuccessStatus: 200 
}
app.use(cors(corsOptions));


app.use('/', TourOfHeroesRoutes)

var port = 3002;

app.listen(port, () => console.log(`Example app listening on port ${port}`))