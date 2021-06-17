import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITeamItem } from "../utils/constants";
import { Team } from "./Team";
import { Title } from "./UI/Title";

const Container = styled.div`
  width: 300px;
  background-color: #fff;
`;


const TeamWrap = styled.div<{ isDragOver: boolean }>`
  background-color: ${({ isDragOver }) =>
    isDragOver ? "lightgoldenrodyellow" : "white"};
  padding: 3px 10px;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction:column;
`;

type Props = {
  teams: {id: string, content: string}[]
  activeTeams: ITeamItem[]
}

export const Column: React.FC<Props> = ({teams, activeTeams}) => {
  return (
    <Container>
      <Title sticky bg="white">Команды</Title>
      <Droppable droppableId="TEAMS" type="TEAMS" isCombineEnabled={true} >
        {(provided, snapshot) => (
          <TeamWrap
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDragOver={snapshot.isDraggingOver}
          >
            {teams.map((team, i) => (
                <Team team={team} index={i} key={team.id} activeTeams={activeTeams.map(team => team.id)} />
              ))}
            {provided.placeholder}
          </TeamWrap>
        )}
      </Droppable>
    </Container>
  );
};
