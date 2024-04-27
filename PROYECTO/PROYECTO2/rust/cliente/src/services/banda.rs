
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
        println!("La solicitud fue exitosa: {:?}", resp_json);
        Ok(resp_json)
    } else {
        println!("La solicitud no fue exitosa: {}", response.status());
        Err("La solicitud no fue exitosa".into())
    }
    
}

pub async fn service_add_banda(banda: Json<Banda>) -> Result<Value, Box<dyn std::error::Error>> {
    
    let banda_inner = banda.into_inner(); 
    // Se pasa el url o endpoint con el cual se interacturara
    let client = reqwest::Client::new();
    let response = client.post("http://127.0.0.1:9798/api/banda").json(&banda_inner).send().await?;
    
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