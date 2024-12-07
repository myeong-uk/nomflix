import { useQuery } from "react-query";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
// import { useScroll } from "framer-motion";
import { getMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import Loader from "../Components/Loader";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import BigMovie from "../Components/BigMovie";
import styled from "styled-components";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 300px;
  position: relative;
  top: -150px;
`

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  // const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data:popularMovies, isLoading: isLoadingPopular } = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopularMovies
  );
  const { data:topRatedMovies, isLoading:isLoadingTopRated } = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopRatedMovies
  );
  const { data:upcomingMovies, isLoading:isLoadingUpcoming } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (data && !leaving) {
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onOverlayClick = () => history.push("/");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
      popularMovies?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
      topRatedMovies?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId) ||
      upcomingMovies?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId));

  return (
    <Wrapper>
      {isLoading || isLoadingPopular || isLoadingTopRated || isLoadingUpcoming ? (
        <Loader />
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
            title={data?.results[0].title || ""}
            overview={data?.results[0].overview || ""}
            onClick={increaseIndex}
          />
          <SliderWrapper>
            <Slider
              movies={data?.results.slice(1) || []}
              index={index}
              offset={offset}
              onBoxClick={onBoxClicked}
              onIndexChange={toggleLeaving}
            />
            <Slider
              movies={popularMovies?.results || []}
              index={index}
              offset={offset}
              onBoxClick={onBoxClicked}
              onIndexChange={toggleLeaving}
            />
            <Slider
              movies={topRatedMovies?.results || []}
              index={index}
              offset={offset}
              onBoxClick={onBoxClicked}
              onIndexChange={toggleLeaving}
            />
            <Slider
              movies={upcomingMovies?.results || []}
              index={index}
              offset={offset}
              onBoxClick={onBoxClicked}
              onIndexChange={toggleLeaving}
            />
          </SliderWrapper>
          {bigMovieMatch && clickedMovie && (
            <BigMovie movieId={clickedMovie.id} onClose={onOverlayClick} />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
