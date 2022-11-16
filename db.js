///////////////////////////////////////////////////////////////////// S E T  U P

const spicedPg = require("spiced-pg");
const { USER, PASSWORD } = process.env;

const user = USER;
const password = PASSWORD;
const database = "petition";

const db = spicedPg(`postgres:${user}:${password}@localhost:5432/${database}`);

///////////////////////////////////////////////////////////////// F U N C T I O N S

///////////////////////////////////////////////// GET INFO

function getPasswordByEmail(email) {
    return db.query("SELECT password, id FROM users WHERE email = $1", [email]);
}

function getSigners() {
    return db
        .query(
            `SELECT users.first_name, users.last_name, user_profiles.city,  user_profiles.url, user_profiles.age
        FROM users
        FULL OUTER JOIN user_profiles
        ON users.id = user_profiles.user_id`
        )
        .then((result) => result);
}

function getSignersInfo({ id }) {
    return db.query(
        `SELECT users.first_name, users.last_name, users.email, user_profiles.city,  user_profiles.url, user_profiles.age, supporterList.signature
        FROM users
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        JOIN supporterList
        ON users.id = user_profiles.user_id
        WHERE id = $1`,
        [id]
    );
    //.then((result) => console.log(result.rows));
}

function getUserById(id) {
    return db
        .query("SELECT * FROM users WHERE id = $1", [id])
        .then((result) => result.rows[0]);
}

function getSignaturebyId({ id }) {
    return db
        .query("SELECT signature FROM supporterList WHERE id = $1", [id])
        .then((result) => result.rows[0]);
}

//USER COUNT
function getUserCounts() {
    return db.query("SELECT COUNT(id) FROM users");
}

// UPDATE SIGNATURE
function updateSupporterList({ signature }) {
    return db
        .query(
            `INSERT INTO supporterlist (
                signature)
    VALUES ($1)
    RETURNING *`,
            [signature]
        )
        .then((result) => result.rows[0]);
}

// UPDATE USERS
function updateUsers({ firstname, lastname, email, password }) {
    return db
        .query(
            `INSERT INTO users (
                first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
            [firstname, lastname, email, password]
        )
        .then((result) => result.rows[0]);
}

// CREATE USER PROFILES INFO
function editProfiles({ age, city, url, user_id }) {
    return db.query(
        `INSERT INTO user_profiles (
                age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
        [age, city, url, user_id]
    );
}

// DELETE PROFILE
function deleteProfile(userId) {
    return db.query(
        `
            DELETE FROM users
            WHERE id=$1
        `,
        [userId]
    );
}

module.exports = {
    updateSupporterList,
    updateUsers,

    getSigners,
    getPasswordByEmail,
    getUserById,
    getSignersInfo,

    editProfiles,
    // deleteProfile,

    getSignaturebyId,
    getUserCounts,
};

// getSignersWithMoreInfo,
// getPasswordAndMoreByEmail,
// getSignersByCity,
// getSignersWithMoreInfo,
// editUsersWithPassword,
// editUsersWithoutPassword,

// function getPasswordAndMoreByEmail(email) {
//     return db.query("SELECT * FROM users WHERE email = $1", [email]);
//     // .then((result) => result.rows[0]);
// }

// function getSignersByCity(city) {
//     return db.query(
//         `SELECT users.first_name, users.last_name, user_profiles.city,  user_profiles.url, user_profiles.age
//         FROM users
//         JOIN user_profiles
//         ON users.id = user_profiles.user_id
//         WHERE user_profiles.city = $1`,
//         [city]
//     );
//     //.then((result) => console.log(result.rows));
// }

// EDIT USERS w PW
// function editUsersWithPassword({ firstname, lastname, email, password, id }) {
//     return db.query(
//         `UPDATE users
//                     SET first_name=$1, last_name=$2, email=$3, password=$4
//                     WHERE id=$5`,
//         [firstname, lastname, email, password, id]
//     );
// }

// //EDIT USERS wo PW
// function editUsersWithoutPassword({ firstname, lastname, email, id }) {
//     return db.query(
//         `UPDATE users
//                     SET first_name=$1, last_name=$2, email=$3
//                     WHERE id=$4`,
//         [firstname, lastname, email, id]
//     );
// }
