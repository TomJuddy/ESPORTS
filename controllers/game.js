/**
 * This is an example controller for the "countries" database table. 
 * You use these methods in your routes as callbacks. For instance, the
 * included method would be for the "/countries" URL.
 * 
 * Eventually, you will have a controller for each entity/table in your
 * database. Each controller contains methods that are used by the routes,
 * and interact with the named entity/table in the database. 
 */

// Gain access to our database connection
const pool = require("../data/config");

const getAllGame = (request, response) => {
    pool.query(`SELECT * FROM game
    order by name asc`, (error, result) => {
        // If we get an error, throw it (this works like a "return" statement)
        if (error){
            throw error;
        }

        // Log the result of the database call to the console.
        console.log(result);

        // Pass the results of the database call to the countries view
        response.render("../views/pages/games", {
            title: "Games",
            gameArray: result
        });         
    });
};

const getGameById = (request, response, next) => {
    const id = request.params.id;
    pool.query(`SELECT * FROM game WHERE game_id = ?`, 
  id, (error, result) => {
            if (error){
                throw error;
            }
 
            console.log(result);
            response.render("../views/pages/game", {
                game: result[0],
                title: "Games"
            });
        });
};

const addGame = (request, response, next) => {
    console.log(request.body);
    pool.query("INSERT INTO Game SET ?", request.body, (error, result) => {
        if (error){
            throw error;
        }
        response.redirect(`/games`);
    });
};

const editGame = (request, response, next) => {
    const id = request.params.id;
 
    console.log(request.body);  
    pool.query(`UPDATE game SET ? WHERE game_id = ?`,
	  [request.body, id], (error, result) => {
        if (error) {
            throw error;
        }
        response.redirect(`/game`);
    });
};


const deleteGame = (request, response, next) => {
    const id = request.params.id;
 
    pool.query(`DELETE FROM game WHERE game_id = ?`, 
  id, (error, result) => {
        if (error){
            throw error;
        }
        console.log(request.body);
        response.redirect(`/game`);
    });
};


// Make this script available elsewhere with the "require" statement
module.exports = {
    getAllGame,
    getGameById,
    addGame,
    editGame,
    deleteGame,
};