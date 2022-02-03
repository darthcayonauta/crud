const express = require('express');
const morgan  = require('morgan');
const exphbs  = require('express-handlebars');
const path    = require('path');
const flash   = require('connect-flash');
const session = require('express-session');
const MySQLStore =  require('express-mysql-session');
const {database} = require('./keys');

//inicializaciones
const app = express();

//settings
app.set( 'port',  process.env.PORT || 4000 );
app.set( 'views', path.join( __dirname, 'views'  ) );
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join( app.get('views') , 'layouts'  ),
    partialsDir: path.join( app.get('views') , 'partials'  ),
    extname : '.hbs',
    helpers: require('./lib/handlebars')
}));

//arrancar el motor
app.set('view engine' , '.hbs'  );

//middlewares
app.use(session({
  secret:'faztmysqlnodesession',
  resave:false,
  saveUninitialized:false,
  store: MySQLStore( database )
}));
app.use( flash() );
app.use( morgan( 'dev' ) );
app.use( express.urlencoded({extended:false}) );
app.use( express.json() );

//globals
app.use( (req,res,next)=>{
    app.locals.success = req.flash('success')
    next();
}  )

//rutas
app.use( require( './routes' )  );
app.use( require( './routes/authentication' )  );
app.use( '/links', require( './routes/links' )  );


//Publics
app.use( express.static( path.join( __dirname, 'public' ) ) );



//start server
app.listen( app.get('port') , ()=>{
    console.log('Servidor en ejecución ' ,app.get( 'port' ));
});
