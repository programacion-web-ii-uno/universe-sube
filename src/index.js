import express from "express";

const PORT = 7_050;
const App = express();

App.get("/transaction", (req, res) => {
    res.send("Hola")
})

function start() {
    console.log(`Server listening on port ${PORT}.`);
    console.log(`http://localhost:${PORT}/`);
}

App.listen(PORT, start);
