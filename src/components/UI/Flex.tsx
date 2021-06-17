import styled, { CSSProperties } from "styled-components"

export type FlexProps = {
  align ?: CSSProperties["alignItems"]
  justify ?: CSSProperties["justifyContent"]
  direction ?: CSSProperties["flexDirection"]
  wrap?: CSSProperties["flexWrap"]
  justifySelf?: CSSProperties["justifySelf"]
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  align-items: ${({align = "stretch"}) => align};
  justify-content: ${({justify = "flex-start"}) => justify};
  flex-direction: ${({ direction = "row" }) => direction};
  flex-wrap: ${({ wrap = "nowrap" }) => wrap};
  justify-self: ${({ justifySelf: self = "stretch" }) => self};

`