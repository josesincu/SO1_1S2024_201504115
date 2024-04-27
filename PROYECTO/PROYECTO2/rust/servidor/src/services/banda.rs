
use rocket::serde::json::{Json};
// import our Date object from the routes/banda module
use crate::routes::banda::Banda;

pub fn service_get_banda() -> Banda {
    
    println!("get banda en rust servidor!");
    let name = String::from("Guerreros de metal Servidor");
    let album = String::from("DarknetServidor");
    let year = String::from("2025");
    let rank = String::from("10");
    let banda_actual = Banda {
        name,
        album,
        year,
        rank
    };
    //retorna banda
    banda_actual
}

pub fn service_add_banda(banda: Json<Banda>) -> Banda {
    
    // creamos un objeto banda y lo retornamos
    let new_banda = Banda {
        name: banda.name.to_string(),
        album: banda.album.to_string(),
        year: banda.year.to_string(),
        rank: banda.rank.to_string()
    };
    println!("insertando banda en rust servidor!");
    //retornamos la banda
    new_banda
}