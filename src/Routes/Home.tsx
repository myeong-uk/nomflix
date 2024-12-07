import { useQuery } from "react-query";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
// import { useScroll } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
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
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const incraseIndex = () => {
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
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
            title={data?.results[0].title || ""}
            overview={data?.results[0].overview || ""}
            onClick={incraseIndex}
          />
          <SliderWrapper>
          <Slider
            movies={data?.results.slice(1) || []}
            index={index}
            offset={offset}
            onBoxClick={onBoxClicked}
            onIndexChange={toggleLeaving}
          />

          </SliderWrapper>
          {bigMovieMatch && clickedMovie && (
            <BigMovie movie={clickedMovie} onClose={onOverlayClick} />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
