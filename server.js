/////////////////////////////////////////////// S E T U P
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
// login-crypt
const bcrypt = require("bcryptjs");
const db = require("./db");

const {
    updateSupporterList,
    updateUsers,
    getSigners,
    getPasswordByEmail,
    editProfiles,
    // getSignersInfo,
} = require("./db");

/////////////////////////////////////////////// R E Q S
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

/////////////////////////////////////////////// U S E

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

/////////////////////////////////////////////// C O O K I E S

app.use(
    cookieSession({
        secret: `I'm always high`,
        maxAge: 1000 * 60 * 60 * 24 * 14, // max age (in milliseconds) is 14 days in this example
        // name: "petition-cookie", a name for our session cookie can be provided (optional)
    })
);

app.use(express.static(path.join(__dirname, "public")));

/////////////////////////////////////////////// R O U T E S

// SESSION CHECK

app.get("/", function (req, res) {
    //check cookies, already registered? show login!
    if (req.session.userId) {
        res.redirect("/login");
        return;
    } else {
        res.render("register");
    }
});

// LANDING
app.post("/register", (req, res) => {
    console.log(req.body);
    const { fname, lname, email, password } = req.body;
    const salt = bcrypt.genSaltSync(); //generate salt
    const hashedRegisterInput = bcrypt.hashSync(password, salt);

    if (!fname || !lname || !email || !password) {
        //reload with error, if smth is missing
        res.render("register");
        return;
    }

    updateUsers({
        firstname: fname,
        lastname: lname,
        email: email,
        password: hashedRegisterInput,
    }).then((usersData) => {
        req.session.userId = usersData.id;
        res.redirect("/profile_form");
    });
});

// LOG IN I
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.render("login");
        return;
    }

    if (email && password) {
        getPasswordByEmail(email).then((objWithPass) => {
            console.log("user info: ", objWithPass);
            bcrypt.compareSync(password, objWithPass.rows[0].password);
            req.session.usersData = { id: objWithPass.rows[0].id };
            db.getSignaturebyId({ id: req.session.usersData.id }).then(
                (data) => {
                    console.log(data);
                    console.log(req.session);
                    if (data?.signature) {
                        res.redirect("/thanks");
                        req.session.usersData.signed = 1;
                        return;
                    } else {
                        res.redirect("/petition");
                    }
                }
            );
        });
    }
});

// GET MORE INFO
app.post("/profile_form", (req, res) => {
    const { fname, lname, email, password, age, city, url } = req.body;

    editProfiles({
        age: age,
        city: city,
        url: url,
        user_id: req.session.userId,
    });
    res.redirect("/petition");
});

// PETITION I
app.post("/petition", (req, res) => {
    const { signature } = req.body;

    if (!signature) {
        res.render("petition");
        return;
    }
    updateSupporterList({
        signature: signature,
    }).then((objIdWithSign) => {
        req.session.signature = objIdWithSign.signature;
        req.session.signed = true;
        res.redirect("/thanks");
    });
});

app.get("/thanks", function (req, res) {
    let signature = req.session.signature;

    getSigners().then((results) => {
        console.log(results.rowCount);
        let signersCount = results.rowCount;
        res.render("thanks", { signature, signersCount });
    });
});

// DELETE SIGNATURE
// app.post("/deletesig", (req, res) => {
//     db.deleteUserSignature(req.session.user_id)
//         .then(() => {
//             req.session.alreadySigned = null;
//             return res.redirect("/petition");
//         })
//         .catch((error) => console.log(error));
// });

/////////////////////////////////////////////////////////// B B s

// REGISTER
app.get("/", function (req, res) {
    res.render("register");
});

// THANKS II
app.get("/thanks", (req, res) => {
    res.render("thanks");
});

// PETITION II
app.get("/petition", (req, res) => {
    res.render("petition");
});

// SIGNERS
app.get("/signers", (req, res) => {
    getSigners().then((results) => {
        res.render("signers", { layout: "signers", signers: results.rows });
    });
});

// LOG IN
app.get("/login", function (req, res) {
    res.render("login");
});

// REGISTER
app.get("/register", (req, res) => {
    res.render("register");
});

// ADD MORE INFO 2 Profile
app.get("/profile_form", (req, res) => {
    res.render("profile_form");
});

// EDIT PROFILE
app.get("/profile_edit", (req, res) => {
    res.render("profile_edit");
});

app.listen(8080);

// if (password) {
//     editUsersWithPassword({
//         firstname: fname,
//         lastname: lname,
//         email: email,
//         password: password,
//         id: req.session.userId,
//     });
//     return;
// }
// if (!password) {
//     editUsersWithoutPassword({
//         firstname: fname,
//         lastname: lname,
//         email: email,
//         id: req.session.userId,
//     });
//     res.redirect("/thanks");
//     return;
// }
