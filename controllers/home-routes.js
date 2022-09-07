const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                iniclude: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // pass a single post object into the homepage template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('homepage.handlebars', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    });

router.get('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user with that email address! '});
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect password! '});
            return;
        }

        req.session.save(() => {
            //declare session variable
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You ae now logged in!' });

            if(req.session.loggedIn) {
                res.redirect('/');
                return;
            }
            res.render('login.handlebars')
        });
    });
})

module.exports = router;