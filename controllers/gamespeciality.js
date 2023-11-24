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

const getAllPlayerGame = (request, response) => {
    pool.query(`SELECT * FROM gamespecialisation`, (error, result) => {
        // If we get an error, throw it (this works like a "return" statement)
        if (error){
            throw error;
        }

        // Log the result of the database call to the console.
        //console.log(result);

        // Pass the results of the database call to the countries view
        response.render("../views/pages/speciality", {
            title: "Games",
            playergameArray: result
        });         
    });
};

const getPlayerGameById = (request, response, next) => {
    const id = request.params.id;
    pool.query(`SELECT * FROM gamespecialisation WHERE player_id = ?`, 
  id, (error, result) => {
            if (error){
                throw error;
            }
 
            //console.log(result);
            response.render("../views/pages/speciality", {
                playergameArray: result,
                title: "Games"
            });
        });
};

const getGamePlayerById = (request, response, next) => {
    const id = request.params.id;
    pool.query(`SELECT player.name as "PlayerName" FROM game
    join gamespecialisation using (game_id)
    join player using(player_id) 
    WHERE game_id = ?`, 
  id, (error, result) => {
            if (error){
                throw error;
            }
 
            //console.log(result);
            response.render("../views/pages/playergame", {
                playergameArray: result,
                title: "Games"
            });
        });
};

const getPlayersGames = (request, response, next) => {
    const id = request.params.id;
    pool.query(`SELECT *, game.name as "GameName", player.name as "PlayerName", player.player_id as "PlayerId"
    from player
    join gamespecialisation
    using (player_id)
    join game 
    using (game_id)
    where player_id = ?`, 
  id, (error, result) => {
            if (error){
                throw error;
            }
 
            //console.log(result);
            response.render("../views/pages/speciality", {
                playergameArray: result,
                playerId: id,
                playerone: result[0],
                title: "Games"
            });
        });
};


const getBadBacks = (request, response, next) => {
    const id = request.params.id;
    pool.query(`select game.game_id, game.name, gamespecialisation.player_id from game
    left join gamespecialisation
    on game.game_id = gamespecialisation.game_id
    and gamespecialisation.player_id = ?
    order by game.name asc`, 
  id, (error, result) => {
            if (error){
                throw error;
            }

    pool.query(`SELECT * FROM game`, 
    id, (error, allGames) => {
                if (error){
                    throw error;
                }
           
 
            console.log("HELLO: ", id);
            response.render("../views/pages/editgames", {
                playergameArray: result,
                //playerone: result[0],
                playerId: id,
                title: "Games",
                games: allGames,
            });
        });
})};

const addPlayerGame = (request, response, next) => {
    //console.log(request.body);
    pool.query("INSERT INTO gamespecialisation SET ?", request.body, (error, result) => {
        if (error){
            throw error;
        }
        response.redirect(`/speciality`);
    });
};

const editPlayerGameSpecialisations = (request, response, next) => {
    const playerId = request.params.id;

    let gamesIdsArr = request.body.game_id || [];
    let gamesToInsert = [];

    console.log("REQUEST BODY: ", request.body);
	/*
		Example request.body where two games were selected:
		
		{ 
			game_id: [ '53', '48' ] 
		}
	*/
    // If the user selected one item, this will be a string.
    // Convert it to an array. If it's empty, do nothing.
    if (gamesIdsArr){
        if (!Array.isArray(gamesIdsArr)){
            gamesIdsArr = [gamesIdsArr];
        }
        for (let i = 0; i < gamesIdsArr.length; i++){
            gamesToInsert.push([playerId, gamesIdsArr[i]]);
        }
    }

    pool.getConnection(function(error, connection) {
        if (error){
            throw error;
        }
    
        // This gets a bit emotional... The connection pool doesn't support database transactions,
        // so we need to access the connection itself.
        // Then, it becomes a nasty chain of queries, each query becomes a child of the previous.
        // This can quickly become very complicated indeed. Welcome to "callback hell"

        // First, get the connection and begin a transaction (essentially a chain of queries)
        connection.beginTransaction( function(error) {
            if (error) {
                throw error;
            }
            // First, delete any references to the player in the game specialisations table
            connection.query(`
                DELETE FROM gamespecialisation WHERE player_id = ?`,
                playerId, (error, result) => {
                    if (error) {
                        return connection.rollback( function() {
                            throw error;
                        });
                    }
                console.log("DELETE QUERY: ", result);

                // Check if we're adding any games to the player. If not, commit and exit.
                if (gamesToInsert.length === 0){
                    return connection.commit( function(error) {
                        connection.release();
                        if (error) {
							// If there's an error, rollback the transaction
                            return connection.rollback( function() {
                                throw error;
                            });
                        }
                        response.redirect(`/players`);
                    })
                }
                
                // If we're adding games to the player, add a query to the chain
                connection.query(`
                    INSERT INTO gamespecialisation(player_id, game_id)
                    VALUES ?`, [gamesToInsert], (error, result) => {
                        if (error) {
                            return connection.rollback( function() {
                                throw error;
                            });
                        }
                    
                    console.log("INSERT QUERY: ", result);

                    // Finally, commit the transaction and remember to release the connection
                    connection.commit( function(error) {
                        connection.release();
                        if (error) {
                            return connection.rollback( function() {
                                throw error;
                            });
                        }
                        
                        console.log("TRANSACTION COMMIT: ", result);
                        response.redirect(`/players`);
                    })
                })
            })
        })
    })
};


const deletePlayerGame = (request, response, next) => {
    const id = request.params.id;
 
    pool.query(`DELETE FROM gamespecialisation WHERE game_id = ?`, 
  id, (error, result) => {
        if (error){
            throw error;
        }
        console.log(request.body);
        response.redirect(`/speciality`);
    });
};




// Make this script available elsewhere with the "require" statement
module.exports = {
    getAllPlayerGame,
    getPlayerGameById,
    addPlayerGame,
    editPlayerGameSpecialisations,
    deletePlayerGame,
    getPlayersGames,
    getBadBacks,
    getGamePlayerById,
};