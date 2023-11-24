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