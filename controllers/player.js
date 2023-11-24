const pool = require("../data/config");

const getAllPlayer = (request, response) => {
    pool.query(`SELECT * FROM player
    order by name asc`, (error, result) => {
        // If we get an error, throw it (this works like a "return" statement)
        if (error){
            throw error;
        }

        // Log the result of the database call to the console.
        console.log(result);

        // Pass the results of the database call to the countries view
        response.render("../views/pages/players", {
            title: "Players",
            playerArray: result
        });         
    });
};

const getPlayerById = (request, response, next) => {
    const id = request.params.id;
    pool.query(`SELECT * FROM player WHERE player_id = ?`, 
  id, (error, result) => {
            if (error){
                throw error;
            }
 
            console.log(result);
            response.render("../views/pages/player", {
                player: result[0],
                title: "Games"
            });
        });
};

const addPlayer = (request, response, next) => {
    console.log(request.body);
    pool.query("INSERT INTO player SET ?", request.body, (error, result) => {
        if (error){
            throw error;
        }
        response.redirect(`/player`);
    });
};

const editPlayer = (request, response, next) => {
    const id = request.params.id;
 
    console.log(request.body);  
    pool.query(`UPDATE player SET ? WHERE player_id = ?`,
	  [request.body, id], (error, result) => {
        if (error) {
            throw error;
        }
        response.redirect(`/player`);
    });
};


const deletePlayer = (request, response, next) => {
    const id = request.params.id;
 
    pool.query(`DELETE FROM player WHERE player_id = ?`, 
  id, (error, result) => {
        if (error){
            throw error;
        }
        console.log(request.body);
        response.redirect(`/player`);
    });
};


// Make this script available elsewhere with the "require" statement
module.exports = {
    getAllPlayer,
    getPlayerById,
    addPlayer,
    editPlayer,
    deletePlayer,
};