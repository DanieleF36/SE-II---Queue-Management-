'use strict';
const express = require('express');
const morgan = require('morgan');                                  // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');
const dayjs = require("dayjs");
const app = express();

passport.use(new LocalStrategy(
    function(username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });
            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, {id: user.id});
});

passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user);
        }).catch(err => {
        done(err, null);
    });
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'))

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'Not authenticated'});
}
const answerDelay = 300;
//Number of total counter, usable for checking
const nCounter = 3;

app.use(session({
    secret:'anjndaljjahuiq8989',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/pages/:id', [
    check('id').isInt(),
], async (req, res)=>{
    try {
        let result = await dao.getPage(req.params.id);
        let paragraph = await dao.getParagraphs(req.params.id);
        let images = await dao.getImages(req.params.id);
        let headers = await dao.getHeaders(req.params.id);
        let block = paragraph.concat(images);
        block = block.concat(headers);
        result.order= block.sort((a, b) => a.pos - b.pos );
        if(result.error)
            res.status(404).json(result);
        else
            res.status(200).json(result);
    } catch(err) {
        console.log(err);
        res.status(500).end();
    }
});

app.post('/api/auth/pages', isLoggedIn, [
    check('title').isLength({min:1}),
    check('creationDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('order').isArray({min: 2})
    ],
    async (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        const page = req.body;
        let h=0, b=0;
        const p = {
            title:page.title,
            author: page.author,
            authorId: req.user.id,
            creationDate: page.creationDate,
            publicationDate: page.publicationDate,
            ord: page.order.map((e)=>{
                if(e.text){
                    b++;
                    return {
                        text: e.text,
                        pos: e.pos
                    }
                }
                else if(e.header) {
                    h++
                    return {
                        header: e.header,
                        pos: e.pos
                    }
                }else{
                    b++;
                    return {
                        id: e.id,
                        pos: e.pos
                    }
                }
            })
        }
        try {
            if( h<1 || b<1) {
                throw {err: "Number of block non right"};
            }
            if(req.user.username != p.author && req.user.administrator){
                const aut = await userDao.getIdByUsername(p.author)
                if(!aut.id)
                    throw {error: "non-existent author"}
                p.authorId = aut.id;
            }
            const id = await dao.addPage(p);
            p.ord.map(async (e) => {
                if (e.text) {
                    await dao.addParagraph(e, id);
                } else if(e.header){
                    await dao.addHeader(e, id);
                } else{
                    await dao.addImage(e, id);
                }
            });
            setTimeout(()=>res.status(200).json(id), answerDelay);
        } catch(err) {
            console.log(err);
            if(err.error && err.error != "Number of block non right" && err.error != "non-existent author")
                res.status(503).json({err: "Database error during the creation of page"});
            res.status(422).json(err);
        }
});

app.put('/api/nextCustomer/:id', [
    check('id').isInt({min: 0})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    try {
        const services = await dao.listServicesByCounter(req.params.id);
        const queueState = await dao.queuesState(services);
        let max = -1;
        let averageTime = -1;
        let next = -1;
        let name = '';
        for(let i of queueState){
            if(i.last - i.current >= max) {
                max = i.last - i.current;
                averageTime = i.averageTime;
                next = i.current +1;
                name = i.name;
            }
        }
        for(let i of queueState){
            if(i.last - i.current == max && i.averageTime < averageTime) {
                averageTime = i.averageTime;
                max = i.last - i.current;
                next = i.current +1;
                name = i.name;
            }
        }
        await dao.updateQueue(name);
        res.status(200).json({service: name, nextCustomer: name+next});
    } catch(err) {
        console.log(err);
        res.status(500).json({errors: ["Database error"]});
    }
});

/** ******************************************************************************************************************************************* **/

app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json(info);
        }
        req.login(user, (err) => {
            if (err)
                return next(err);
            return res.json(req.user);
        });
    })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
else
    res.status(401).json({error: 'Unauthenticated user!'});;
});

app.delete('/api/sessions/current', (req, res) => {
    req.logout( ()=> { res.end(); } );
});


const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));