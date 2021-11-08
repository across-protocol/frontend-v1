import { FC } from "react";
import styled from "@emotion/styled";
import heroBg from "assets/hero-across-bg.png";
import BulletImg from "assets/Across-logo-bullet.svg";

const About: FC = () => {
  return (
    <Wrapper>
      <Hero>
        <HeroHeader>
        Instantly Send Assets from Layer 2 Rollups to Ethereum
        </HeroHeader>
      </Hero>
      <BodyWrapper>
        <BulletWrapper>
          <BulletImage src={BulletImg} alt="across_logo" />
          <BulletTextWrapper>
            <BulletHeader>Instantaneous Liquidity</BulletHeader>
            <BulletText>
              Assets are bridged and available for use in the next block 
              mined on Ethereum. 
            </BulletText>
          </BulletTextWrapper>
        </BulletWrapper>
        <BulletWrapper>
          <BulletImage src={BulletImg} alt="across_logo" />
          <BulletTextWrapper>
            <BulletHeader>Secure</BulletHeader>
            <BulletText>
              Powered by UMA protocol. Transfers are secured by UMA's Optimistic Oracle, which
              is audited by OpenZeppelin and trusted by top teams to protect hundreds
              of millions of dollars in value.
            </BulletText>
          </BulletTextWrapper>
        </BulletWrapper>
        <BulletWrapper>
          <BulletImage src={BulletImg} alt="across_logo" />
          <BulletTextWrapper>
            <BulletHeader>Cheap</BulletHeader>
            <BulletText>
              Relayers and liquidity providers are compensated with fees from users
              initiating transfers, but this fee is less than any other solution on
              the market.
              <br /> <br />
              <Link
                href="https://umaproject.org"
                target="_blank"
                rel="noreferrer"
              >
                Read more here
              </Link>
            </BulletText>
          </BulletTextWrapper>
        </BulletWrapper>
      </BodyWrapper>
    </Wrapper>
  );
};

const Hero = styled.div`
  background-image: url(${heroBg});
  min-height: 25vh;
  height: auto;
`;

const HeroHeader = styled.h1`
  color: hsla(166, 92%, 70%, 1);
  font-size: 3.5rem;
  font-weight: 700;
  font-family: "Barlow";
  line-height: 4.5rem;
  width: 80%;
  max-width: 800px;
  margin-left: 10vw;
  padding-top: 2.5rem;
`;

const Wrapper = styled.div``;

const BodyWrapper = styled.div`
  padding: 1.5rem;
`;

const Link = styled.a`
  font-family: "Barlow";
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1rem;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  text-decoration: underline;
  color: var(--color-primary);
  &:hover {
    cursor: pointer;
  }
`;

const BulletWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const BulletImage = styled.img`
  flex-basis: 20%;
  height: 35px;
  width: 35px;
`;

const BulletTextWrapper = styled.div`
  flex-basis: 50%;
`;

const BulletText = styled.h4`
  font-family: "Barlow";
  font-weight: 400;
  font-size: 1rem;
  line-height: 1rem;
  margin-bottom: 1rem;
`;

const BulletHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5rem;
  font-family: "Barlow";
  margin-bottom: 1rem;
`;

export default About;
