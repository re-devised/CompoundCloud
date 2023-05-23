
module.exports = function(app){
    var cors = require('cors');
    // enables cors
    app.use(
      cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        preflightContinue: true
      })
    );
}
