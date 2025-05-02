import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { movieRoutes } from "./routes/movieRoutes.ts"; // Import the movie routes
import { authRoutes } from "./routes/authRoutes.ts"; // Import the auth routes
import { userRoutes } from "./routes/userRoutes.ts"; // Import the user routes
import { deviceRoutes } from './routes/deviceRoutes.ts'; // Import the device routes
import { planRoutes } from './routes/planRoutes.ts'; // Import the plan routes
import { billRoutes } from './routes/billRoutes.ts'; // Import the bill routes
import { mediaRoutes } from './routes/mediaRoutes.ts'; // Import the media routes
import { reviewRoutes } from './routes/reviewRoutes.ts'; // Import the media routes



const app = express();
const port = 8080;

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/movies", movieRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/devices", deviceRoutes)
app.use("/api/v1/plans", planRoutes)
app.use("/api/v1/bills", billRoutes)
app.use("/api/v1/media", mediaRoutes)
app.use("/api/v1/reviews", reviewRoutes)

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});