import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MovieInstance from '../../Components/MovieInstance/MovieInstance.jsx'

import "./Style/movie.css"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { BsStarFill, BsStar } from "react-icons/bs"

import heart from "./heart.svg"

function MoviePage(props) {
    //refresh

    const location = useLocation()
    const { movieId } = location.state

    const [stars, setstars] = useState([])

    const [movie, setmovie] = useState({})

    const [recomended, setrecomended] = useState([])
    const [similar, setsimilar] = useState([])


    const [credits, setcredits] = useState([])

    const favouriteButton = useRef(null)

    const [movieIsFavourite, setmovieIsFavourite] = useState(false)

    const IMDB_API_KEY = "k_vak98huk"
    //https://imdb-api.com/en/API/Ratings/k_vak98huk/{imdbId}

    //links
    //backdrop_path




    useEffect(() => {
        //checking if component should update manually
        let mainDataInstance = null
        props.getData(`movie/${movieId}`)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                mainDataInstance = data
                setmovie(data)
                handleMovieRating(mainDataInstance.vote_average)
                return props.getData(`movie/${data.id}/recommendations`)
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setrecomended(data.results)
                return props.getData(`movie/${mainDataInstance.id}/similar`)
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setsimilar(data.results)
                return props.getData(`movie/${mainDataInstance.id}`, "&append_to_response=credits")
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                let temporaryCredits = []
                for (let i = 0; i < 4; i++) {
                    temporaryCredits.push(`${data.credits.cast[i].name}, `)
                }
                setcredits(temporaryCredits)
                handleSavingMovie(mainDataInstance.id, "visited")
                checkIfMovieIsInFavourites()
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])


    function handleMovieRating(rating) {
        let numberOfStars = 5
        let maxRating = 10
        let ratingInStars = maxRating / numberOfStars
        let starsActive = Math.round(rating / ratingInStars)

        let temporaryArray = []

        for (let i = 0; i < starsActive; i++) {
            temporaryArray.push(i)
        }
        setstars(temporaryArray)
    }


    //Adding to local storage (Visited or favourites)
    function handleSavingMovie(number, type) {
        let parsedData = null
        let storageData = null
        let parsedDataArray = []
        if (window.localStorage.getItem(type) !== null) {
            parsedData = JSON.parse(window.localStorage.getItem(type))
            parsedDataArray = Array.from(parsedData)
            storageData = [...parsedDataArray, number]
        }
        else {
            storageData = [number]
        }
        //Checking if movie is already added to storage
        if (!parsedDataArray.includes(number)) {
            window.localStorage.setItem(type, JSON.stringify(storageData))
        }
    }

    function checkIfMovieIsInFavourites() {
        if ((window.localStorage.getItem("favourites") !== null)) {
            let parsedData = JSON.parse(window.localStorage.getItem("favourites"))
            let parsedDataArray = Array.from(parsedData)
            if (parsedDataArray.includes(movieId)) {
                setmovieIsFavourite(true)
                favouriteButton.current.style.background = "red"
            }
        }
    }



    return (
        <div className="main__movie__container">
            <div className="top__part">
                <div className="backposter__container">
                    <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} alt="" />
                </div>
                <div className="info__container">
                    <div className="image__container">
                        <div className="under__poster__container">
                            <div className="poster__image">
                                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" className="poster__img" />
                                <h3 className="runtime">{movie.runtime} min</h3>
                            </div>
                            <div className="stars">
                                <div className="rating__container">
                                    <div className="inside__stars">
                                        {stars.map((star) => {
                                            return (
                                                <BsStarFill style={{ color: "yellow" }} className="star">
                                                </BsStarFill>
                                            )
                                        })}
                                    </div>
                                    <div className="imdb__rating">
                                        <a target="_blank" href={`https://www.imdb.com/title/${movie.imdb_id}/`}>IMDB</a>
                                    </div>
                                </div>
                            </div>
                            <div className="add__to__favorites">
                                <img ref={favouriteButton} onClick={() => {
                                    if (!movieIsFavourite) {
                                        favouriteButton.current.style.background = "red"
                                        handleSavingMovie(movie.id, "favourites")
                                        setmovieIsFavourite(true)
                                    }
                                    else {
                                        favouriteButton.current.style.background = "black"
                                        props.removeFromFavourites(movieId)
                                        setmovieIsFavourite(false)
                                    }
                                }} src={heart} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="text__info__container">
                        <div className="title__container">
                            <h3 className="title">{movie.title}</h3>
                            <p className="text">{movie.overview}</p>
                        </div>
                        <div className="credits__container">
                            <h3 className="title">Credits</h3>
                            <p className="text">{credits}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom__part">
                <h1 className="bottom__part__text">RECOMENDED</h1>
                <div className="recomended__container">
                    {recomended.map((movie, index) => {
                        if (index < 6) {
                            let movieGenres = []
                            props.getGenres(movie)
                                .then((responseData) => {
                                    movieGenres = responseData
                                })
                            return (
                                <div className="recomended">
                                    <MovieInstance
                                        origin={true}
                                        getData={props.getData}
                                        movie={movie}
                                        key={movie.id}
                                        genres={movieGenres}
                                    />
                                </div>
                            )
                        }
                    })}
                </div>
                <h1 className="bottom__part__text">SIMILAR</h1>
                <div className="similar__container">
                    {similar.map((movie, index) => {
                        if (index < 6) {
                            let movieGenres = []
                            props.getGenres(movie)
                                .then((responseData) => {
                                    movieGenres = responseData
                                })
                            return (
                                <div className="similar">
                                    <MovieInstance
                                        origin={true}
                                        getData={props.getData}
                                        movie={movie}
                                        key={movie.id}
                                        genres={movieGenres}
                                    />
                                </div>
                            )
                        }
                    })}
                </div>
            </div>

        </div>
    )
}

export default MoviePage

