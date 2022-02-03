const {format} = require('timeago.js');
//timeagoInstance = timeago();

const helpers = {};

helpers.timeago = ( timestamp )=>{
    return format( timestamp );

}; 


module.exports = helpers;
