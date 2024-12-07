import styled from "styled-components";

const BannerWrapper = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

interface BannerProps {
  bgPhoto: string;
  title: string;
  overview: string;
  onClick: () => void;
}

function Banner({ bgPhoto, title, overview, onClick }: BannerProps) {
  return (
    <BannerWrapper bgPhoto={bgPhoto} onClick={onClick}>
      <Title>{title}</Title>
      <Overview>{overview}</Overview>
    </BannerWrapper>
  );
}

export default Banner;
