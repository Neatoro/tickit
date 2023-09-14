const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const apiRouter = express.Router();

app.use(helmet());
app.use(cors());

app.use('/api', apiRouter);

require('./controller')({ apiRouter });

app.listen(3000, () => {
  console.log('Ticket system started on port 3000');
});
