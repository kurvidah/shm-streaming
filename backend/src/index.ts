import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { movieRoutes } from "./routes/movieRoutes.ts"; // Import the movie routes
import { authRoutes } from "./routes/authRoutes.ts"; // Import the auth routes

const app = express();
const port = 8080;

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/movies", movieRoutes)
app.use("/api/v1/auth", authRoutes)

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
