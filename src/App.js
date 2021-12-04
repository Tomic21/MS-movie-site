//-------------API KEY-------------
// e0d512f22b5823229e6f8aba260e1c20


//LIBARIES
import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


//COMPONENTS
import NavigationBar from "./Components/NavigationBar/NavigationBar.jsx";
import LandingPage from "./Pages/Landing_Page/LandingPage.jsx";
import MoviePage from "./Pages/Movie_Page/MoviePage.jsx";
import VisitedPage from "./Pages/Visited_Page/VisitedPage.jsx";
import FavouritesPage from "./Pages/Favourites_Page/FavouritesPage.jsx";

//STYLE
import "./Style/app.css"


//API STUFF
const APIKEY = "e0d512f22b5823229e6f8aba260e1c20"
const baseURL = "https://api.themoviedb.org/3/"





class App extends Component {
  constructor() {
    super()
    this.getData = this.getData.bind(this)
    this.handleGettingGenres = this.handleGettingGenres.bind(this)
    this.removeFromFavourites = this.removeFromFavourites.bind(this)
    this.clearMoviesFromStorage = this.clearMoviesFromStorage.bind(this)
  }

  componentDidMount() {
  }


  getData(urlData, aditionalData = "") {
    function urlFactory() {
      let url = ""
      url = `${baseURL}${urlData}?api_key=${APIKEY}${aditionalData}`
      return url;
    }
    return (fetch(urlFactory())
      .then((response) => {
        if (response.status === 200) {
          return response
        }
        else {
          throw new Error("invalid Url")
        }
      })
      .catch((err) => {
        console.log(err)
      })
    )
  }
  handleGettingGenres(movie, returnFullArray = false) {
    return (this.getData("genre/movie/list")
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        // console.log(element)
        let thisMovieGenres = []

        //checking if {genres__ids} are avalible or {genres} are avalible 
        if (movie.genre_ids === undefined) {
          movie.genres.forEach((genre) => {
            thisMovieGenres.push(genre.name.toString())
          })
        }
        else {
          movie.genre_ids.forEach(id => {
            data.genres.forEach(genre => {
              if (genre.id === id) {
                //adding data to genres array
                thisMovieGenres.push(genre.name)
              }
            });
          });
        }

        return thisMovieGenres
      }))
  }
  removeFromFavourites(movieId) {
    if ((window.localStorage.getItem("favourites") !== null)) {
      let parsedData = JSON.parse(window.localStorage.getItem("favourites"))
      let parsedDataArray = Array.from(parsedData)
      const filteredData = parsedDataArray.filter((movieInStorage) => {
        if (movieId != movieInStorage) {
          return movieInStorage
        }
      })
      window.localStorage.setItem("favourites", JSON.stringify(filteredData))
    }
  }
  clearMoviesFromStorage(type) {
    window.localStorage.removeItem(type)
  }
  render() {
    return (
      <Router>
        <NavigationBar
          getData={this.getData}
          getGenres={this.handleGettingGenres}
        />
        <Routes>
          <Route path="/" exact element={
            <LandingPage
              getData={this.getData}
            />} />
          <Route path="/movie" element={
            <MoviePage
              getData={this.getData}
              getGenres={this.handleGettingGenres}
              removeFromFavourites={this.removeFromFavourites}
            />} />
          <Route path="/visited" element={
            <VisitedPage
              getData={this.getData}
              getGenres={this.handleGettingGenres}
              clearMoviesFromStorage={this.clearMoviesFromStorage}
            />} />
          <Route path="/favourites" element={
            <FavouritesPage
              getData={this.getData}
              getGenres={this.handleGettingGenres}
              removeFromFavourites={this.removeFromFavourites}
              clearMoviesFromStorage={this.clearMoviesFromStorage}
            />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
