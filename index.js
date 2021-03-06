const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()

const articles = []

const newspapers = [
    {
        name: "thetimes",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: "https://www.thetimes.co.uk"
    },
    {
        name: "guardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: "https://www.theguardian.com"
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change",
        base: "https://www.telegraph.co.uk"
    }
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text().trim()
                let url = ""
                if (newspaper.address === "https://www.telegraph.co.uk/climate-change") {
                    url = newspaper.base + $(this).attr("href")
                } else {
                    url = $(this).attr("href")
                }

                articles.push({
                    title,
                    url,
                    source: newspaper.name
                })

            })
        }).catch(err => console.log(err))
})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.listen(PORT, () => console.log(`server is running on ${PORT}`))
