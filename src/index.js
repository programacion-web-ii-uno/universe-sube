const express = require("express");
const transactionsRoutes = require('./routes/transaction.routes.js');

const PORT = 7_050;
const App = express();

App.use(express.json());
App.use('/api/transaction', transactionsRoutes.Router);

App.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
    console.log(`http://localhost:${PORT}/`);
});
