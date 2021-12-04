import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MovieInstance from '../../Components/MovieInstance/MovieInstance'


import "./Style/favourites.css"





function FavouritesPage(props) {

    let movies = []
    const [moviesdisplay, setmoviesdisplay] = useState([])
    const location = useLocation()

    window.localStorage.setItem("sessionV", null)
    if (window.localStorage.getItem("sessionF") === "null") {
        window.location.reload()
        window.localStorage.setItem("sessionF", 1)
    }

    useEffect(() => {
        //refresing 

        //Geting data from page
        try {
            movies = (Array.from(JSON.parse(window.localStorage.getItem("favourites"))))//here change
        } catch (error) {
            console.log(error)
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
                                    <button title="Remove from favourites" onClick={() => {
                                        props.removeFromFavourites(movie.id)
                                        window.location.reload()
                                    }
                                    } className="remove__from__favourites__button">X</button>
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
        <>
            <main className="favourites__container">
                <div className="favourits__text">
                    <h1 className="title">Favourites</h1>
                    <button onClick={() => {
                        props.clearMoviesFromStorage("favourites")//here change
                        window.location.reload()
                    }} className="clear__favourites">
                        Clear Favourites
                    </button>
                </div>
                <div className="movies__container">
                    {moviesdisplay}
                </div>
            </main>
        </>
    )
}

export default FavouritesPage
