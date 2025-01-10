const express = require('express')
const app = express()
const userRouter = require('./routes/user.routes')
const dotenv = require('dotenv')
const connectToDB = require('./config/db')
const cookieParser = require('cookie-parser')
const indexRoutes = require('./routes/index.routes')
const fileRoutes = require('./routes/fileRoutes'); 

connectToDB();
    
dotenv.config();

app.use(express.static('public'));

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/',indexRoutes )
app.use('/',userRouter)


app.listen(4000, () => {
    console.log('Server Hosted on 3000 Port');

})