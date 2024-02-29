import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import StartRating from "./StarRating";
import CircularProgress from "@mui/material/CircularProgress";
import BoxMUI from "@mui/material/Box";
import { MdDelete } from "react-icons/md";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "96119904";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]); //an array of watched movie
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState("");
  const [query, setQuery] = useState("");
  const [Id, setId] = useState(null);

  function handleMovieClick(id) {
    // setId(Id === id ? null : id);
    setId((Id) => (Id === id ? null : id));
  }
  function handleCloseMovie() {
    setId(null);
  }

  function handleWatchedMovieList(movie) {
    setWatched((watched) => [...watched, movie]);
    alert("Movie added to your favourites");
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((watched) => watched.Id !== id));
  }
  useEffect(() => {
    async function fetchMovies() {
      try {
        setisLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        if (!res.ok) {
          throw new Error("Something went wrong with the response");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("No movies found");
        }
        setMovies(data.Search);
        setisLoading(false);
      } catch (err) {
        console.log(err.message);
      } finally {
        setisLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      seterror("");
      return;
    }
    // will stop at this function ntil length is increase upto three
    fetchMovies(); //must call it again so that data is fetched again
  }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleMovieClick={handleMovieClick} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {Id ? (
            <MovieDetails
              Id={Id}
              handleCloseMovie={handleCloseMovie}
              handleWatchedMovieList={handleWatchedMovieList}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return <p>⚠ {message}</p>;
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}
function Loading() {
  return (
    <BoxMUI
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Center horizontally
        height: "100vh", // Set height to the full viewport height
      }}
    >
      <CircularProgress />
    </BoxMUI>
  );
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, handleMovieClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleMovieClick={handleMovieClick}
        />
      ))}
    </ul>
  );
}

function MovieDetails({
  Id,
  handleCloseMovie,
  handleWatchedMovieList,
  watched,
}) {
  const [Movie, setMovie] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [userRating, setuserRating] = useState(0);

  const {
    Title: title,
    Yaer: year,
    Poster: poster,
    imdbRating,
    Released: released,
    Plot: plot,
    Actors: actors,
    Director: director,
    Genre: genre,
    Runtime: runTime,
  } = Movie;
  useEffect(() => {
    async function showMovieDetails() {
      setisLoading(true);
      const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${Id}`);
      const data = await res.json();
      setMovie(data);
      setisLoading(false);
    }
    showMovieDetails();
  }, [Id]);

  function handleWatched() {
    const movie = {
      title: title,
      imdbRating: Number(imdbRating),
      year: year,
      poster: poster,
      Id: Id,
      userRating: userRating,
      runTime: Number(runTime.split(" ").at(0)),
    };
    handleWatchedMovieList(movie);
    handleCloseMovie();
  }

  const watchedUserrating = watched.find(
    (movie) => movie.Id === Id
  )?.userRating;
  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <header>
              <button
                className="btn-back"
                type="button"
                onClick={() => handleCloseMovie()}
              >
                <IoIosArrowBack />
              </button>
              <img src={poster} alt={`Poster of movie ${Movie}`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} . {genre}
                </p>
                <p>
                  <span>⭐</span>
                  {imdbRating}
                </p>
              </div>
            </header>

            {!watched.some((item) => item.Id === Id) ? (
              <div className="rating">
                <StartRating
                  maxRating={10}
                  size={24}
                  onSetRating={setuserRating}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleWatched}>
                    + Add to List
                  </button>
                )}
              </div>
            ) : (
              <div className="rating" style={{ margin: "5px" }}>
                <p>Already Rated! {watchedUserrating}⭐</p>
              </div>
            )}

            <section>
              <p>
                <em>{plot}</em>
              </p>
              <p>
                <b>Starring</b> {actors}
              </p>
              <p>Directors {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
function Movie({ movie, handleMovieClick }) {
  // console.log(movie.imdbID);
  return (
    <li onClick={() => handleMovieClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runTime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleDeleteWatched={handleDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runTime} min</span>
        </p>
        <button onClick={() => handleDeleteWatched(movie.Id)}>
          <MdDelete />
        </button>
      </div>
    </li>
  );
}
