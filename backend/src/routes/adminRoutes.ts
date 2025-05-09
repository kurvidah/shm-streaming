import express from "express"
import { admin, protect } from "../middleware/authMiddleware"
import {
    getAll,
    getById,
    createOne,
    updateOne,
    deleteOne
} from "../controllers/adminController";

const router = express.Router()

let allowedFields = {
    users: ["username", "email", "password", "role", "gender", "birthdate", "region"],
    devices: ["device_type", "device_name", "user_id"],
    media: ["episode", "season", "description", "file_path", "status"],
    movies: ["title", "description", "release_date", "duration", "rating"],
    movie_genre: ["movie_id", "genre_id"],
    genres: ["genre_name", "genre_description"],
    user_subscription: ["plan_id", "user_id", "start_date", "end_date"],
    subscription_plan: ["plan_name", "price", "max_devices", "hd_available", "ultra_hd_available", "duration_days"],
    reviews: ["user_id", "movie_id", "media_id", "rating", "review_text"],
    billing: ["user_id", "subscription_id", "due_date", "payment_date", "payment_status", "payment_method", "amount"],
}

router
    .route("/billings")
    .get(admin, getAll("billing"))
    .post(admin, createOne("billing", allowedFields['billing']))

router
    .route("/billings/:id")
    .get(admin, getById("billing"))
    .put(admin, updateOne("billing", allowedFields['billing']))
    .delete(admin, deleteOne("billing"))

router
    .route("/devices")
    .get(admin, getAll("devices"))
    .post(admin, createOne("devices", allowedFields['devices']))

router
    .route("/devices/:id")
    .get(admin, getById("devices"))
    .put(admin, updateOne("devices", allowedFields['devices']))
    .delete(admin, deleteOne("devices"))

router
    .route("/media")
    .get(admin, getAll("media"))
    .post(admin, createOne("media", allowedFields['media']))

router
    .route("/media/:id")
    .get(admin, getById("media"))
    .put(admin, updateOne("media", allowedFields['media']))
    .delete(admin, deleteOne("media"))

router
    .route("/movies")
    .get(admin, getAll("movies"))
    .post(admin, createOne("movies", allowedFields['movies']))

router
    .route("/movies/:id")
    .get(admin, getById("movies"))
    .put(admin, updateOne("movies", allowedFields['movies']))
    .delete(admin, deleteOne("movies"))

router
    .route("/plans")
    .get(admin, getAll("subscription_plan"))
    .post(admin, createOne("subscription_plan", allowedFields['subscription_plan']))

router
    .route("/plans/:id")
    .get(admin, getById("subscription_plan"))
    .put(admin, updateOne("subscription_plan", allowedFields['subscription_plan']))
    .delete(admin, deleteOne("subscription_plan"))

router
    .route("/reviews")
    .get(admin, getAll("reviews"))
    .post(admin, createOne("reviews", allowedFields['reviews']))

router
    .route("/reviews/:id")
    .get(admin, getById("reviews"))
    .put(admin, updateOne("reviews", allowedFields['reviews']))
    .delete(admin, deleteOne("reviews"))

router
    .route("/subscriptions")
    .get(admin, getAll("user_subscription"))
    .post(admin, createOne("user_subscription", allowedFields['user_subscription']))

router
    .route("/subscriptions/:id")
    .get(admin, getById("user_subscription"))
    .put(admin, updateOne("user_subscription", allowedFields['user_subscription']))
    .delete(admin, deleteOne("user_subscription"))

router
    .route("/users")
    .get(admin, getAll("users"))
    .post(admin, createOne("users", allowedFields['users']))

router
    .route("/users/:id")
    .get(admin, getById("users"))
    .put(admin, updateOne("users", allowedFields['users']))
    .delete(admin, deleteOne("users"))

export const adminRoutes = router