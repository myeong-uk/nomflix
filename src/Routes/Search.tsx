import { useLocation } from "react-router";
import { useQuery } from "react-query";
import { searchMovie, searchTv, IGetMoviesResult } from "../api";
import Loader from "../Components/Loader";
import Slider from "../Components/Slider";
import styled from "styled-components";
import {useState} from "react";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 300px;
  position: relative;
  top: 200px;
`;

const offset = 6;

const NextBTn = styled.button`
  width: 100px;
  align-self: center;
  border: none;
  color: white;
  background-color: brown;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movieResults, isLoading: loadingMovies } = useQuery<IGetMoviesResult>(
    ["search", "movie", keyword],
    () => searchMovie(keyword),
    { enabled: !!keyword } // only fetch when keyword exists
  );

  const { data: tvResults, isLoading: loadingTv } = useQuery<IGetMoviesResult>(
    ["search", "tv", keyword],
    () => searchTv(keyword),
    { enabled: !!keyword } // only fetch when keyword exists
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (movieResults && !leaving) {
      toggleLeaving();
      const totalMovies = movieResults.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  if (!keyword) {
    return <p>No keyword provided for search.</p>;
  }

  if (loadingMovies || loadingTv) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <SliderWrapper>
        {movieResults && (
          <Slider
            movies={movieResults.results || []}
            index={index}
            offset={offset}
            onIndexChange={toggleLeaving}
          />
        )}
        {tvResults && (
          <Slider
            movies={tvResults.results || []}
            index={index}
            offset={offset}
            onIndexChange={toggleLeaving}
          />
        )}
        <NextBTn onClick={increaseIndex}>Next Page</NextBTn>
      </SliderWrapper>
    </Wrapper>
  );
}

export default Search;
