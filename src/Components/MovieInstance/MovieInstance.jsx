import React from 'react'
import { Link } from 'react-router-dom'

import "./Style/movieInstance.css"



//single movie component
function MovieInstance(props) {

    const imageLink = `https://image.tmdb.org/t/p/w154/${props.movie.poster_path}`


    return (
        <Link
            style={{ textDecoration: 'none' }}
            onClick={() => {
                if (props.origin != false)
                    window.location.reload()
            }
            } to="/movie"
            state={{ movieId: props.movie.id }}
        >
            <div className="movie__instance__container">
                <div className="movie__image__container">
                    <img src={imageLink} alt="" className="movie__img" />
                    <div
                        style={props.movie.vote_average >= 6 ?
                            { background: "chartreuse" } :
                            { background: "red" }} className="movie__rating__container">
                        {props.movie.vote_average}
                    </div>
                </div>
                <div className="movie__text__container">
                    <p style={{ textDecoration: 'none' }} className="title">{props.movie.title}</p>
                    <p className="year">{props.movie.release_date.substring(0, 4)}</p>
                    {props.genres !== undefined ? props.genres.map((genre, index) => {
                        return (
                            <span key={index}>{genre} </span>
                        )
                    }) : null}
                </div>
            </div>
        </Link>
    )
}

export default MovieInstance
