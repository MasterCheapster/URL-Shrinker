//calling libraries 
const express = require('express')
const mongoose = require('mongoose')
// const ShortUrl = require('./models/shortUrl')
const app = express()
const ShortUrl=require('./models/shortUrl')
//creating a database
mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})
app.set('view engine',"ejs");
//taking a function with request and a response
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})
//asyncronous action, its happening in background
//waiting for it to finish before moving on
app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})
//passing short url
//then appended one to the clicks
//then getting the full url and redirecting
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})
//server
app.listen(process.env.PORT || 5000) ;
