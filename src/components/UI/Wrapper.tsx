import styled, { css, CSSProperties } from "styled-components";

type Props = {
  sticky?: boolean;
  top?: CSSProperties["top"];
  center?: boolean;
};

export const Wrapper = styled.div<Props>`
  ${(props) =>
    props.sticky &&
    css`
      display: table;
      position: sticky;
      top: ${props.top || 0};
    `}
  
${(props) =>
    props.center &&
    css`
      text-align: center;
    `}
`;
