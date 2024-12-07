import { useQuery } from "react-query";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
// import { useScroll } from "framer-motion";
import { getAiringTodayTv, getPopularTv, getTopRatedTv, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import Loader from "../Components/Loader";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import BigTv from "../Components/BigTv";
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
`;

const offset = 6;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  // const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["tv", "airingToday"],
    getAiringTodayTv
  );
  const { data: popularTv, isLoading: isLoadingPopular } = useQuery<IGetMoviesResult>(
    ["tv", "popular"],
    getPopularTv
  );
  const { data: topRatedTv, isLoading: isLoadingTopRated } = useQuery<IGetMoviesResult>(
    ["tv", "topRated"],
    getTopRatedTv
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (data && !leaving) {
      toggleLeaving();
      const totalTvs = data.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  const onOverlayClick = () => history.push("/tv");

  const clickedTv =
    bigTvMatch?.params.tvId &&
    (data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId) ||
      popularTv?.results.find((tv) => tv.id === +bigTvMatch.params.tvId) ||
      topRatedTv?.results.find((tv) => tv.id === +bigTvMatch.params.tvId));

  return (
    <Wrapper>
      {isLoading || isLoadingPopular || isLoadingTopRated ? (
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
              movies={popularTv?.results || []}
              index={index}
              offset={offset}
              onBoxClick={onBoxClicked}
              onIndexChange={toggleLeaving}
            />
            <Slider
              movies={topRatedTv?.results || []}
              index={index}
              offset={offset}
              onBoxClick={onBoxClicked}
              onIndexChange={toggleLeaving}
            />
          </SliderWrapper>
          {bigTvMatch && clickedTv && (
            <BigTv tvId={clickedTv.id} onClose={onOverlayClick} />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
