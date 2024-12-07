import styled from "styled-components";

const LoaderWrapper = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Loader() {
  return <LoaderWrapper>Loading...</LoaderWrapper>;
}

export default Loader;
