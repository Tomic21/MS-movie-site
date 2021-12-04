import React, { Component } from 'react'
import MovieInstance from '../../Components/MovieInstance/MovieInstance'



import "./Style/landing.css"



export class LandingPage extends Component {
    constructor(props) {
        super(props)



        this.state = {


            display: {
                popular: [],
                top_rated: [],
                upcoming: [],
            },
        }
        this.movies = {
            popular: [],
            top_rated: [],
            upcoming: [],
        }
        //CLASS VARIABLES
        this.movieNumbers = {
            popular: 0,
            top_rated: 0,
            upcoming: 0,
        }
        this.moviesLoaded = {
            popular: false,
            top_rated: false,
            upcoming: false,
        }

        this.currentMovie = "popular"

        this.pageNumberPopular = 1
        this.pageNumberTopRated = 1
        this.pageNumberUpcoming = 1



        this.movieGenres = []

        this.handleMovies = this.handleMovies.bind(this)
        this.handleMovieArray = this.handleMovieArray.bind(this)
        this.handleMovieMaping = this.handleMovieMaping.bind(this)
        this.handleSelectorButtons = this.handleSelectorButtons.bind(this)

        //buttonRefs
        this.popularButton = React.createRef();
        this.topRatedButton = React.createRef();
        this.visitedButton = React.createRef();



    }
    componentDidMount() {
        //Calling handle movies method to load first 12 movies and passing default parameters.
        this.handleMovies("popular", 12)
        //when refreshing setting underline to popular buton
        this.handleSelectorButtons(this.popularButton)
    }

    handleMovieArray(add, branche) {
        //Seting movie array to previous + new movie array when loading new movies..
        this.movies[branche].push(...add)
    }

    handleMovies(movieBranche, numberOfMoviesToLoad, caller = "bottomButton") {
        //Checking if code should update according to name of calling function
        let runCode = true
        this.currentMovie = movieBranche
        if (this.currentMovie === movieBranche && caller === "topButton" && this.moviesLoaded[movieBranche] === true) {
            runCode = false
            this.handleMovieMaping()
        }
        else if (this.moviesLoaded[movieBranche] === false) {
            this.moviesLoaded[movieBranche] = true
        }

        if (runCode) {
            //Setting current movie state so button(load more movies) knows which movies to load when clicked.

            //Updating arrayOfMovies
            let numberOfMovies = 0;
            if (this.movieNumbers[movieBranche] !== 0) {
                numberOfMovies = this.movieNumbers[movieBranche]
            }
            else {
                numberOfMovies = 12
            }
            this.movieNumbers[movieBranche] += numberOfMoviesToLoad
            let pageNumber = 0
            //Checking which movie branche page is calling method...
            if (movieBranche === "popular") {
                //Seting local variables to global variables 
                //because method accepts generic movieBranche... This could be shrinked with for loop. 
                pageNumber = this.pageNumberPopular
            }
            else if (movieBranche === "top_rated") {
                pageNumber = this.pageNumberTopRated
            }
            else if (movieBranche === "upcoming") {
                pageNumber = this.pageNumberUpcoming
            }
            if (this.movies[movieBranche].length - numberOfMovies < 12) {
                this.props.getData(`movie/${movieBranche}/`, `&page=${pageNumber}`)
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        //Updating internal state
                        this.handleMovieArray(data.results, movieBranche)
                        //Udating display state
                        this.handleMovieMaping(movieBranche)

                        if (movieBranche === "popular") {
                            this.pageNumberPopular++;
                        }
                        else if (movieBranche === "top_rated") {
                            this.pageNumberTopRated++;
                        }
                        else if (movieBranche === "upcoming") {
                            this.pageNumberUpcoming++;
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
            else {
                this.handleMovieMaping(movieBranche)
            }
        }
    }


    handleMovieMaping() {
        //error on MovieDB site because of dusplicate Pulp Fiction
        let newId = 0
        let randomID = 218735178235172


        const dummyObjectForMovies = this.state.display
        //fetched data of genres 
        this.props.getData("genre/movie/list")
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                dummyObjectForMovies[this.currentMovie] =
                    this.movies[this.currentMovie].map((element, index) => {
                        //THIS IS ADDED BECAUSE OF DUPLICATE ID ON MOVIE DB
                        //--------------------------------------------------------
                        newId = element.id
                        if (element.id === 680) {
                            newId = randomID
                            randomID++;
                        }
                        //--------------------------------------------------------
                        if (index < this.movieNumbers[this.currentMovie]) {
                            let thisMovieGenres = []
                            // console.log(element)
                            element.genre_ids.forEach(id => {
                                data.genres.forEach(genre => {
                                    if (genre.id === id) {
                                        //adding data to genres array
                                        thisMovieGenres.push(genre.name)
                                    }
                                });
                            });
                            return (
                                <MovieInstance
                                    getData={this.props.getData}
                                    movie={element}
                                    genres={thisMovieGenres}
                                    key={newId}
                                    origin={false}
                                />
                            )
                        }
                    })

                this.setState({
                    display: dummyObjectForMovies
                })
            })
        //Needed for changing nested states
    }

    handleSelectorButtons(callingRef) {
        this.popularButton.current.style.textDecoration = "none"
        this.topRatedButton.current.style.textDecoration = "none"
        this.visitedButton.current.style.textDecoration = "none"
        callingRef.current.style.textDecoration = "underline"
    }


    render() {
        return (
            <main className="landing__page">
                <div className="landing__page__container">
                    <div className="landing__page__top__container">
                        <ul className="landing__page__navbar">
                            <li
                                ref={this.popularButton}
                                onClick={
                                    () => {
                                        this.handleMovies("popular", 12, "topButton")
                                        this.handleSelectorButtons(this.popularButton)
                                    }

                                } className="landing__page__navbar__button">Popular</li>
                            <li
                                ref={this.topRatedButton}
                                onClick={
                                    () => {
                                        this.handleMovies("top_rated", 12, "topButton")
                                        this.handleSelectorButtons(this.topRatedButton)
                                    }

                                } className="landing__page__navbar__button">Top Rated</li>
                            <li
                                ref={this.visitedButton}
                                onClick={
                                    () => {
                                        this.handleMovies("upcoming", 12, "topButton")
                                        this.handleSelectorButtons(this.visitedButton)
                                    }

                                } className="landing__page__navbar__button">Upcoming</li>
                        </ul>
                    </div>
                    <div className="landing__page__movies">
                        <div className="landing__page__movies__container">
                            {/* MOVIE COMPONENTS */}
                            {
                                this.state.display[this.currentMovie]
                            }
                        </div>
                    </div>
                    <div className="landing__page__button__container">
                        <button onClick={() => { this.handleMovies(this.currentMovie, 12) }} className="landing__page__button">LOAD MORE</button>
                    </div>
                </div>
            </main>
        )
    }
}

export default LandingPage