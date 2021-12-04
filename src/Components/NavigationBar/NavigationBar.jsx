import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MovieInstance from '../MovieInstance/MovieInstance'
import { FaSearch } from "react-icons/fa"

//STYLE
import "./style/navigationBar.css"

//search/multi
//&language=en-US&query=spiderman&page=1&include_adult=false

function NavigationBar(props) {

    const [search, setsearch] = useState("")
    const inputRef = useRef(null)
    const searchResultsDiv = useRef(null)
    const [movies, setmovies] = useState([])
    let moviesGlobal = []
    const location = useLocation()
    let origin1 = true
    console.log(location.pathname)
    if (location.pathname === "/favourites" || location.pathname === "/visited" || location.pathname === "/") {
        origin1 = false
    }

    useEffect(() => {
        if (search != "") {
            props.getData("search/multi", `&language=en-US&query=${search}&page=1&include_adult=false`)
                .then((response) => {
                    return response.json()
                })
                .then((dataRaw) => {
                    return Array.from(dataRaw.results)
                })
                .then(data => {
                    return data.map(movie => {
                        return props.getData(`movie/${movie.id}`, "&language=en-US")
                            .then((response) => {
                                return response.json()
                            })
                            .then(data => {
                                return data
                            })
                            .catch((err) => {
                            })
                    });
                })
                .then((responseArray) => {

                    responseArray.map(response => {
                        response.then((data) => {
                            if (data !== undefined) {
                                moviesGlobal.push(data)
                            }
                            let newArray = moviesGlobal.map((movie, index) => {
                                if (index < 8) {
                                    let duplicateIdKey = movie.id + 10000000
                                    console.log(origin1)
                                    return (
                                        <MovieInstance
                                            origin={origin1}
                                            getData={props.getData}
                                            movie={movie}
                                            key={duplicateIdKey}
                                        />
                                    )
                                }
                            })
                            setmovies(newArray)
                        })
                    }
                    )
                })
                .catch((err) => {
                })
        }
        else {
            setmovies([])
        }
    }, [search])



    return (
        <section>
            <main className="nav__bar__main">
                <div className="nav__bar__container">
                    <Link className="home__button" to="/">
                        Home
                    </Link>
                    <div className="nav__bar__container__left">
                        <div className="search__bar__container">
                            <FaSearch className="search__bar__icon"></FaSearch>
                            <input
                                ref={inputRef}
                                value={search}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        searchResultsDiv.current.style.display = "none"
                                    }
                                    else {
                                        searchResultsDiv.current.style.display = "flex"
                                    }
                                }}
                                onClick={() => {
                                    searchResultsDiv.current.style.display = "flex"
                                }}
                                onChange={() => {
                                    moviesGlobal = []
                                    setsearch(inputRef.current.value)
                                }} type="text" className="search__bar__input" />
                            <main onClick={() => { searchResultsDiv.current.style.display = "none" }} ref={searchResultsDiv} className="search__results__main">
                                {movies}
                            </main>
                        </div>
                    </div>
                    <div className="nav__bar__container__right">
                        <Link className="nav__bar__container__right__link" to="/favourites">
                            Favourites
                        </Link>
                        <h3 className="nav__bar__container__right__decor">|</h3>
                        <Link className="nav__bar__container__right__link" to="/visited">
                            Visited
                        </Link>
                    </div>
                </div>
            </main>

        </section>
    )
}

export default NavigationBar

