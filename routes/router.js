const router = (app) => {

//Run Controllers.js

    const gameController = require("../controllers/game");
    const teamController = require("../controllers/team");
    const playerController = require("../controllers/player");
    const gamespecialityController = require("../controllers/gamespeciality");

//App.Gets
    //games
    app.get("/game", gameController.getAllGame);
    app.get("/games", gameController.getAllGame);
    app.get("/game/:id", gameController.getGameById);
    //teams
    app.get("/teams", teamController.getAllTeam);
    app.get("/teams/:id", teamController.getTeamById);
   
    //players
    app.get("/player", playerController.getAllPlayer);
    app.get("/players", playerController.getAllPlayer);
    app.get("/player/:id", playerController.getPlayerById);
    //Players games
    app.get("/speciality", gamespecialityController.getAllPlayerGame);
    app.get("/speciality/:id", gamespecialityController.getPlayersGames);
    app.get("/editgames", gamespecialityController.getPlayersGames);
    app.get("/editgames/:id", gamespecialityController.getBadBacks);
    

    app.get("/editteam", teamController.getAllTeam);
    app.get("/editteam/:id", teamController.getTeamById);
   
    app.get("/playergame", gamespecialityController.getGamePlayerById);
    app.get("/playergame/:id", gamespecialityController.getGamePlayerById);

    
   

    //Home page
    app.get("/", (request, response) => {
        response.render("../views/pages/HomePage", {
            title: "Esports"
        });
    });



    app.get("/players", (request, response) => {
        response.render("../views/pages/players", {
            title: "Players"
        });
    });
    //About page
    app.get("/about", (request, response) => {
        response.render("../views/pages/about", {
            title: "About"
        });
    });
    //Team page
    app.get("/teams", (request, response) => {
        response.render("../views/pages/teams", {
            title: "About"
        });
    });
   
    //add a game page
    app.get("/add", (request, response) => {
        response.render("../views/pages/add", {
            title: "Add"
        });
    });
    //Add Team page
    app.get("/addteam", (request, response) => {
        response.render("../views/pages/addteam", {
            title: "Add"
        });
    });
    //Edit team page
    app.get("/editteam/:id", (request, response) => {
        response.render("../views/pages/editteam", {
            title: "Add"
        });
    });
    //Add player page
    app.get("/addplayer", (request, response) => {
        response.render("../views/pages/addplayer", {
            title: "Add"
        });
    });
    //404 page
     app.get("*", (request, response) => {
	response.render("../views/pages/404", {
		title: "404"
	    });
    });


//App.Posts


    app.post("/games", gameController.addGame);
    app.post("/game/edit/:id", gameController.editGame);
    app.post("/game/delete/:id", gameController.deleteGame);


    app.post("/teams", teamController.addTeam);
    app.post("/team/delete/:id", teamController.deleteTeam);


    app.post("/players", playerController.addPlayer);
    app.post("/player/edit/:id", playerController.editPlayer);
    app.post("/player/delete/:id", playerController.deletePlayer);


    app.post("/specialitys",gamespecialityController.addPlayerGame);
    app.post("/speciality/edit/:id", gamespecialityController.editPlayerGameSpecialisations);
    app.post("/speciality/delete/:id", gamespecialityController.deletePlayerGame);
    app.post("/speciality", gamespecialityController.getPlayersGames);
    app.post("/speciality/:id", gamespecialityController.editPlayerGameSpecialisations);

    app.post("/editteam/delete/:id", teamController.deleteTeam);
    app.post("/editteam/:id", teamController.editTeam);

    
    app.post("/editgames",gamespecialityController.addPlayerGame);
    app.post("/editgames/delete/:id", gamespecialityController.deletePlayerGame);
    app.post("/editgames/:id", gamespecialityController.editPlayerGameSpecialisations);

};




module.exports = router;