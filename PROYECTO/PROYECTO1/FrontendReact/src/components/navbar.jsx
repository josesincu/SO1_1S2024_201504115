import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/">  Datos </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/real"> Tiempo real </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/history"> Historico  </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/processtree"> Arbol de procesos  </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/diagram"> Diagrama de estados </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar