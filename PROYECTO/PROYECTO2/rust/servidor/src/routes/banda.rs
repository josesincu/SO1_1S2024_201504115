use rocket::serde::json::{Json};
use rocket::serde::{Serialize, Deserialize};

// import services module
use crate::services;

// create a struct to hold our Date data
// need serialize/deserialize to convert to/from JSON
#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Banda {
    pub name: String,
    pub album: String,
    pub year: String,
    pub rank: String
}

// create get-current-date route under /date and call get_current_date service which will return a Date object
// route returns a Date object converted to JSON
#[get("/banda")]
pub fn route_get_banda() -> Json<Banda> {
    Json(services::banda::service_get_banda())
}

// route will accept data in JSON format and expects a date variable in the function parameters
#[post("/banda", format = "json", data = "<banda>")]
pub fn route_add_banda(banda: Json<Banda>) -> Json<Banda> {
    Json(services::banda::service_add_banda(banda))
}
