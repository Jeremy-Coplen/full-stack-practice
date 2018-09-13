require("dotenv").config()
const express = require("express")
const session = require("express-session")
const axios = require("axios")
const massive = require("massive")

const app = express()

app.use(express.static(`${__dirname}/../build`))

const {
    SERVER_PORT,
    SESSION_SECRET,
    REACT_APP_DOMAIN,
    REACT_APP_CLIENT_ID,
    CLIENT_SECRET,
    CONNECTION_STRING,
    ENVIROMENT
} = process.env

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) =>  {
    if(ENVIROMENT === "dev") {
        req.app.get("db").set_data().then(userData => {
            req.session.user = userData[0]
            next()
        })
    }
    else {
        next()
    }
})

app.get("/auth/callback", async (req, res) => {
    const db = req.app.get("db")
    const { code } = req.query

    const payload = {
        client_id: REACT_APP_CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: `http://${req.headers.host}/auth/callback`
    }
   let tokenRes = await axios.post(`https://${REACT_APP_DOMAIN}/oauth/token`, payload)
   let userRes = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo?access_token=${tokenRes.data.access_token}`)

   const { email, name, picture, sub } = userRes.data
   let foundUser = await db.find_user([sub])
   if(foundUser[0]) {
       req.session.user = foundUser[0]
   }
   else {
       let createdUser = await db.create_user([name, email, picture, sub])
       req.session.user = createdUser[0]
   }
   res.redirect("/#/private")
})

app.get("/api/user-data", (req, res) => {
    if(req.session.user) {
        res.status(200).send(req.session.user)
    }
    else {
        res.status(401).send("Go login")
    }
})

app.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("http://localhost:3000/#/")
})

massive(CONNECTION_STRING).then(db => {
    app.set("db", db)
    app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}`))
})