import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utils";

const SliderWrapper = styled.div`
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: { x: window.outerWidth + 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 },
};

const boxVariants = {
  normal: { scale: 1 },
  hover: { scale: 1.3, y: -80, transition: { delay: 0.5, type: "tween" } },
};

const infoVariants = {
  hover: { opacity: 1, transition: { delay: 0.5, type: "tween" } },
};

interface SliderProps {
  movies: { id: number; title?: string; name?:string; backdrop_path: string }[];
  index: number;
  offset: number;
  onBoxClick?: (movieId: number) => void;
  onIndexChange: () => void;
}

function Slider({ movies, index, offset, onBoxClick, onIndexChange }: SliderProps) {
  return (
    <SliderWrapper>
      <AnimatePresence initial={false} onExitComplete={onIndexChange}>
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {movies
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                key={movie.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                onClick={() => onBoxClick && onBoxClick(movie.id)}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title || movie.name}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </SliderWrapper>
  );
}

export default Slider;
