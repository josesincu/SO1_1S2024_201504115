// import Rocket
#[macro_use] extern crate rocket;

// add our routes and services modules
mod routes;
mod services;

// import our routes
use routes::banda::route_get_banda;
use routes::banda::route_add_banda;

//use reqwest;

// start the web server and mount our get route at "/api". Can replace /api with anything
// or just leave it as "/" as the default location

//#[launch]
//#[tokio::rocket]
#[launch]
fn rocket() -> _ {

    rocket::build().configure(rocket::Config::figment().merge(("port", 9797))).mount("/api", routes![route_get_banda, route_add_banda])    
}