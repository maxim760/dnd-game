import styled, {css, CSSProperties} from "styled-components"

type Props = {
  center?: boolean
  sticky?: boolean
  bg?: CSSProperties["backgroundColor"]
  size?: CSSProperties["fontSize"]
  padding ?: CSSProperties["padding"]
}

export const Title = styled.h2<Props>`
  font-size: ${({size = "28px"}) => size};
  padding: ${({padding = "10px"}) => padding};
  ${({ center }) => center && css`
    text-align: center;
  `}
  ${({ bg }) => bg && css`
    background-color: ${bg};
  `}
  ${({ sticky }) => sticky && css`
    position: sticky;
    top: 0;
  `}
  
`;

export const SubTitle = styled(Title).attrs({ as: "h4" })`
  padding: 4px;
  font-size: 22px;
`