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
pub async fn route_get_banda() -> Json<Banda>{
    //Obtenemos el serde_json::value
    let r = services::banda::service_get_banda().await;
    //println!("La solicitud fue exitosa: {:?}", r);
    // Suponiendo que `object` es un `serde_json::Value` que contiene el objeto JSON
    match r {
        Ok(valor) => {
            // Aquí puedes acceder al valor correctamente
            println!("El valor es: {:?}",valor["name"]);
            Json(ok_banda(valor))
        }
        Err(err) => {
            // Manejar el error
            println!("Ocurrió un error: {}", err);
            
            Json(error_banda())
        }
    }
}

// route will accept data in JSON format and expects a date variable in the function parameters
#[post("/banda", format = "json", data = "<banda>")]
pub fn route_add_banda(banda: Json<Banda>) -> Json<Banda> {

    println!("insertando banda en rust!");
    Json(services::banda::service_add_banda(banda))
}


/**
 *  CREACION DE METODO DE REQUEST RETORNA BANDO SI ES OK
 * 
 */
fn ok_banda(valor : serde_json::Value) -> Banda{
    let name = valor["name"].to_string();
    let album = valor["album"].to_string();
    let year = valor["year"].to_string();
    let rank = valor["rank"].to_string();

    let banda = Banda {
        name,
        album,
        year,
        rank
    };
    banda
}

/**
 *  CREACION DE METODO DE REQUEST RETORNA BANDO SI ES ERROR
 * 
 */
fn error_banda() -> Banda{
    let name =String::from("");
    let album =String::from("");
    let year = String::from("");
    let rank = String::from("");

    let banda = Banda {
        name,
        album,
        year,
        rank
    };
    banda
}

