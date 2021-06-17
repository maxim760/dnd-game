import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled, { css } from "styled-components";
type DragBlockProps = Record<"isDragging" | "isCombine" | "isCombinedWith" | "isDisabled", boolean>

const DragBlock = styled.div<DragBlockProps>`
  text-align: center;
  padding: 4px 10px;
  width: 60%;
  outline: 0;
  border: ${({ isDragging }) =>
    isDragging ? "2px dashed green" : "1px solid black"};
  background-color: ${({ isCombine, isDisabled }) => (isDisabled ? "gray" : isCombine ? "lightblue" : "white")};
  transition: background-color 0.2s ease-in;
  border-radius: 10px;
  margin-bottom: 5px;
  ${({ isDisabled }) => isDisabled && css`
    pointer-events: none;
  `}
  ${({ isCombinedWith }) => isCombinedWith && css`
    background-color: salmon;
  `}

`;


interface Props {
  team: { id: string; content: string }
  index: number;
  activeTeams: string[]
}

export const Team: React.FC<Props> = ({ team, index, activeTeams }) => {
  const isDisabled = activeTeams.indexOf(team.id) === -1
  return (
    <Draggable draggableId={team.id} index={index} isDragDisabled={isDisabled} >
      {(provided, snapshot) => {
        return (
          <DragBlock
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          isCombine={activeTeams.includes(snapshot.combineTargetFor!)}
          isCombinedWith={activeTeams.includes(snapshot.combineWith!)}
          isDisabled={isDisabled}
        >
          {team.content}
        </DragBlock>
        )
      }
        
      }
    </Draggable>
  );
};
