import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utils";

// 오버레이 스타일링 (배경 어두운 반투명)
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

// 영화 상세창 스타일링
const BigMovieWrapper = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  max-width: 800px;
  height: 80vh;
  border-radius: 20px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

// 영화 배경 이미지 스타일링
const BigCover = styled.div`
  width: 100%;
  height: 45%;
  background-size: cover;
  background-position: center center;
  filter: brightness(0.7);
`;

// 영화 제목 스타일링
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
  margin: 0;
`;

// 영화 개요 스타일링
const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 1.1rem;
  line-height: 1.5;
  overflow-y: auto;
  max-height: 30vh;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
`;

// 추가 정보 스타일링 (개봉일, 런타임, 장르 등)
const AdditionalInfo = styled.div`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 1.1rem;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
`;

// 정보 항목 스타일링 (한 줄로 표시되는 항목)
const InfoItem = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 300;
`;

// 닫기 버튼 스타일링
const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: ${(props) => props.theme.white.lighter};
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

interface MovieDetails {
  title: string;
  overview: string;
  backdrop_path: string;
  release_date?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

interface BigMovieProps {
  tvId: number;
  onClose: () => void;
}

function BigTv({ tvId, onClose }: BigMovieProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}?api_key=958a2ba52a17b56a5320e5698bd1b258&language=en-US`
        );
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [tvId]);

  if (loading) {
    return <Overlay exit={{ opacity: 0 }} animate={{ opacity: 1 }} />;
  }

  if (!movieDetails) {
    return null;
  }

  return (
    <>
      <Overlay onClick={onClose} exit={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <BigMovieWrapper>
        <BigCover
          style={{
            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
              movieDetails.backdrop_path,
              "w500"
            )})`,
          }}
        />
        <CloseButton onClick={onClose}>Close</CloseButton>
        <BigTitle>{movieDetails.title}</BigTitle>
        <BigOverview>{movieDetails.overview}</BigOverview>
        <AdditionalInfo>
          <InfoItem>
            <span>Release Date:</span>
            <span>{movieDetails.release_date}</span>
          </InfoItem>
          <InfoItem>
            <span>Runtime:</span>
            <span>{movieDetails.runtime} mins</span>
          </InfoItem>
          <InfoItem>
            <span>Genres:</span>
            <span>
              {movieDetails.genres?.map((genre) => genre.name).join(", ") || "N/A"}
            </span>
          </InfoItem>
        </AdditionalInfo>
      </BigMovieWrapper>
    </>
  );
}

export default BigTv;
