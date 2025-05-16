import express from "express"
import { admin, mod, protect } from "../middleware/authMiddleware"
import {
    getAll,
    getById,
    createOne,
    updateOne,
    deleteOne
} from "../controllers/crudController";
import { createMovie, getMovieById, getMovies, updateMovie } from "../controllers/movieController";
import { getUsers } from "../controllers/userController";
import { fetchActiveSubscriptions, fetchDashboardSummary, fetchMonthlyRevenue, fetchUsersByGender, fetchUsersByPlan, fetchUsersByRegion } from "../controllers/dashboardController";
import { getUserBills } from "../controllers/paymentController";
import { getUserSubscriptions } from "../controllers/subscriptionController";

const router = express.Router()

let allowedFields = {
    users: ["username", "email", "role", "gender", "birthdate", "region"],
    devices: ["device_type", "device_name", "user_id"],
    media: ["movie_id", "episode", "season", "description", "file_path", "status"],
    movies: ["title", "description", "release_date", "duration", "rating", "imdb_id"],
    movie_genre: ["movie_id", "genre_id"],
    genres: ["genre_name", "genre_description"],
    user_subscription: ["plan_id", "user_id", "start_date", "end_date"],
    subscription_plan: ["plan_name", "price", "max_devices", "hd_available", "ultra_hd_available", "duration_days"],
    reviews: ["user_id", "movie_id", "media_id", "rating", "review_text"],
    billing: ["user_id", "subscription_id", "due_date", "payment_date", "payment_status", "payment_method", "amount"],
}

router
    .route("/billings")
    .get(mod, getUserBills)
    .post(admin, createOne("billing", allowedFields['billing']))

router
    .route("/billings/:id")
    .get(mod, getById("billing", "billing_id"))
    .put(mod, updateOne("billing", allowedFields['billing']))
    .delete(admin, deleteOne("billing", "billing_id"))

router
    .route("/devices")
    .get(mod, getAll("devices"))
    .post(admin, createOne("devices", allowedFields['devices']))

router
    .route("/devices/:id")
    .get(mod, getById("devices", "device_id"))
    .put(mod, updateOne("devices", allowedFields['devices']))
    .delete(admin, deleteOne("devices", 'device_id'))

router
    .route("/media")
    .get(mod, getAll("media"))
    .post(mod, createOne("media", allowedFields['media']))

router
    .route("/media/:id")
    .get(mod, getById("media", "media_id"))
    .put(mod, updateOne("media", allowedFields['media']))
    .delete(admin, deleteOne("media", "media_id"))

router
    .route("/movies")
    .get(mod, getMovies)
    .post(mod, createMovie)

router
    .route("/movies/:id")
    .get(mod, getMovieById)
    .put(mod, updateMovie)
    .delete(admin, deleteOne("movies", "movie_id"))

router
    .route("/plans")
    .get(mod, getAll("subscription_plan"))
    .post(admin, createOne("subscription_plan", allowedFields['subscription_plan']))

router
    .route("/plans/:id")
    .get(mod, getById("subscription_plan", "plan_id"))
    .put(admin, updateOne("subscription_plan", allowedFields['subscription_plan']))
    .delete(admin, deleteOne("subscription_plan", "plan_id"))

router
    .route("/reviews")
    .get(mod, getAll("reviews"))
    .post(mod, createOne("reviews", allowedFields['reviews']))

router
    .route("/reviews/:id")
    .get(mod, getById("reviews", "review_id"))
    .put(mod, updateOne("reviews", allowedFields['reviews']))
    .delete(mod, deleteOne("reviews", "review_id"))

router
    .route("/subscriptions")
    .get(mod, getUserSubscriptions)
    .post(admin, createOne("user_subscription", allowedFields['user_subscription']))

router
    .route("/subscriptions/:id")
    .get(mod, getById("user_subscription", "user_subscription_id"))
    .put(mod, updateOne("user_subscription", allowedFields['user_subscription']))
    .delete(admin, deleteOne("user_subscription", "user_subscription_id"))

router
    .route("/users")
    .get(mod, getUsers)
    .post(admin, createOne("users", [...allowedFields['users'], "password"]))

router
    .route("/users/:id")
    .get(mod, getById("users", "user_id", ["password"]))
    .put(mod, updateOne("users", allowedFields['users'], "user_id"))
    .delete(admin, deleteOne("users", "user_id"))

router
    .route("/dashboard/summary")
    .get(mod, fetchDashboardSummary)

router
    .route("/dashboard/users-by-gender")
    .get(mod, fetchUsersByGender)

router
    .route("/dashboard/users-by-plan")
    .get(mod, fetchUsersByPlan)

router
    .route("/dashboard/users-by-region")
    .get(mod, fetchUsersByRegion)

router
    .route("/dashboard/revenue")
    .get(mod, fetchMonthlyRevenue)

router
    .route("/dashboard/active-subscription")
    .get(mod, fetchActiveSubscriptions)

export const adminRoutes = router