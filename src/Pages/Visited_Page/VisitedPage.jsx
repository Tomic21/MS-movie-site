import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MovieInstance from '../../Components/MovieInstance/MovieInstance'

import "./Style/visited.css"

function VisitedPage(props) {
    let movies = []
    const [moviesdisplay, setmoviesdisplay] = useState([])
    const location = useLocation()


    window.localStorage.setItem("sessionF", null)
    if (window.localStorage.getItem("sessionV") === "null") {
        window.location.reload()
        window.localStorage.setItem("sessionV", 1)
    }
    useEffect(() => {
        //refreshing
        //Geting data from page
        try {
            movies = (Array.from(JSON.parse(window.localStorage.getItem("visited"))))//here change
        } catch (error) {
            return
        }

        let moviesDataTemporary = []
        movies.forEach((movieId, index) => {
            props.getData(`movie/${movieId}`)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    moviesDataTemporary.push(data)
                    if ((movies.length - 1) === index) {
                        mapMovie(moviesDataTemporary)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        });
    }, [location.key])

    function mapMovie(moviesData) {
        {
            let movieGenresFullArray = []
            const p = new Promise((resolve, reject) => {
                moviesData.map((movie, index) => {
                    props.getGenres(movie)
                        .then((responseData) => {
                            movieGenresFullArray.push(responseData)
                            if (moviesData.length - 1 === index) {
                                resolve("ok")
                            }
                            else {
                            }
                        })
                })
            })
            p.
                then(() => {
                    setmoviesdisplay(
                        moviesData.map((movie, index) => {
                            return (
                                <div className="one__movie__container">
                                    <MovieInstance
                                        origin={false}
                                        getData={props.getData}
                                        movie={movie}
                                        genres={movieGenresFullArray[index]}
                                        key={movie.id}
                                    />
                                </div>
                            )
                        })
                    )
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    return (
        <main className="favourites__container">
            <div className="favourits__text">
                <h1 className="title">Visited</h1>
                <button onClick={() => {
                    props.clearMoviesFromStorage("visited")//here change
                    window.location.reload()
                }} className="clear__favourites">
                    Clear Visited
                </button>
            </div>
            <div className="movies__container">
                {moviesdisplay}
            </div>
        </main>
    )
}

export default VisitedPage
