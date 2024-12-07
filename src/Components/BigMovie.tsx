import { motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovieWrapper = styled(motion.div)`
  position: fixed; /* 스크롤과 관계없이 화면 중앙에 고정 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 정확히 중앙 정렬 */
  width: 40vw;
  height: 80vh;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

interface BigMovieProps {
  movie: { title: string; overview: string; backdrop_path: string };
  onClose: () => void;
}

function BigMovie({ movie, onClose }: BigMovieProps) {
  return (
    <>
      <Overlay onClick={onClose} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <BigMovieWrapper>
        <BigCover
          style={{
            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
              movie.backdrop_path,
              "w500"
            )})`,
          }}
        />
        <BigTitle>{movie.title}</BigTitle>
        <BigOverview>{movie.overview}</BigOverview>
      </BigMovieWrapper>
    </>
  );
}

export default BigMovie;
