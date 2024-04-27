
use rocket::serde::json::{Json};
use serde_json::Value;
// import our Date object from the routes/banda module
use crate::routes::banda::Banda;
use reqwest;


pub async fn service_get_banda() -> Result<Value, Box<dyn std::error::Error>>{
    // Se pasa el url o endpoint con el cual se interacturara
    let response = reqwest::get("http://127.0.0.1:9798/api/banda").await?;
    
    // Verifica si la solicitud fue exitosa (código de estado 200 OK)
    if response.status().is_success() {
        // Lee y muestra el cuerpo de la respuesta
        let resp_json = response.json::<Value>().await?;
        Ok(resp_json)
    } else {
        println!("La solicitud no fue exitosa: {}", response.status());
        Err("La solicitud no fue exitosa".into())
    }
    
}

pub fn service_add_banda(banda: Json<Banda>) -> Banda {
    
    // creamos un objeto banda y lo retornamos
    let new_banda = Banda {
        name: banda.name.to_string(),
        album: banda.album.to_string(),
        year: banda.year.to_string(),
        rank: banda.rank.to_string()
    };
    //retornamos la banda
    new_banda
}