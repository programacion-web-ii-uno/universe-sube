const express = require("express");
const morgan = require('morgan');

const TransactionsRoutes = require('./routes/transaction.routes.js');

const PORT = 7_050;
const App = express();

App.use(morgan('dev'));
App.use(express.json());

App.use('/api/transaction', TransactionsRoutes.Router);

App.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
    console.log(`http://localhost:${PORT}/`);
});
