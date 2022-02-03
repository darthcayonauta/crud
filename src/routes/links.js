const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add',( req,res )=>{
    res.render( 'links/add' );
});


//para que await funcione es necesario colocar async antes de la funcion principal
//es lo que recibe desde el form ... por es el post
router.post( '/add', async (req,res)=>{

    //console.log( req.body ); es la data que recibe desde el form propiamente tal
    const {title,url,description} =  req.body;
    const newLink = {
        title,
        url,
        description
    };

    console.log(newLink);

    await pool.query('INSERT INTO links set ?',[newLink]);
    req.flash('success', 'Link saved ok!');
    res.redirect('/links');


});

router.get( '/', async ( req,res )=>{
  const links = await pool.query( 'SELECT * FROM links' );
  res.render('links/list', {links:links}  );
});


router.get( '/delete/:id', async (req,res )=>{

  //res.send( 'Eliminado!!' );
  //sólo requiero el id de sistema
  const {id} = req.params;
  await pool.query( 'DELETE FROM links WHERE id=?', [id] );
  res.redirect('/links');
});


router.get('/edit/:id', async (req,res) =>{

  const {id} = req.params;
  const links = await pool.query( 'SELECT * FROM links WHERE id = ?',[id] );
  res.render( 'links/edit',{links:links[0]} );
});


router.post( '/edit/:id', async ( req,res )=>{
  const {id} = req.params;

  //capturo los elementos del formulario
  const {title,description,url} = req.body;

  //y los guardo en newLink
  const newLink = {
    title,
    description,
    url
  };

  await pool.query('UPDATE links SET ? WHERE id = ?',[newLink, id]);

  res.redirect('/links');

});


/*
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');


// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});
*/
module.exports = router;
