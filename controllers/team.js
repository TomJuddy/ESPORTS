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

const getAllTeam = (request, response) => {
    pool.query(`SELECT * FROM team`, (error, result) => {
        // If we get an error, throw it (this works like a "return" statement)
        if (error){
            throw error;
        }

        // Log the result of the database call to the console.
        console.log(result);

        // Pass the results of the database call to the countries view
        response.render("../views/pages/teams", {
            title: "Games",
            teamArray: result
        });         
    });
};

const getTeamById = (request, response, next) => {
    const id = request.params.id;
    pool.query(`SELECT * FROM team WHERE team_id = ?`, 
  id, (error, result) => {
            if (error){
                throw error;
            }
 
            console.log(result);
            response.render("../views/pages/editteam", {
                team: result[0],
                title: "teams"
            });
        });
};

const addTeam = (request, response, next) => {
    console.log(request.body);
    pool.query("INSERT INTO team SET ?", request.body, (error, result) => {
        if (error){
            throw error;
        }
        response.redirect(`/teams`);
    });
};

const editTeam = (request, response, next) => {
    const id = request.params.id;
 
    console.log(request.body);  
    pool.query(`UPDATE team SET WHERE team_id = ?`,
	  [request.body, id], (error, result) => {
        if (error) {
            throw error;
        }
        response.redirect(`/teams`);
    });
};


const deleteTeam = (request, response, next) => {
    const id = request.params.id;
 
    pool.query(`DELETE FROM team WHERE team_id = ?`, 
  id, (error, result) => {
        if (error){
            throw error;
        }
        console.log(request.body);
        response.redirect(`/teams`);
    });
};




// Make this script available elsewhere with the "require" statement
module.exports = {
    getAllTeam,
    getTeamById,
    addTeam,
    editTeam,
    deleteTeam,
   
};