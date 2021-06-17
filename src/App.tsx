import React, { useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import update, { extend } from "immutability-helper";
import styled from "styled-components";
import { Column } from "./components/Column";
import { Table } from "./components/Table";
import { SubTitle, Title, Wrapper, Flex } from "./components/UI";
import { IDragEndFn } from "./types";

import {
  IResults,
  ITeamItem,
  ITEMS_DATA,
  POINTS,
  RESULTS_DATA,
} from "./utils/constants";
import { sampleSize } from "./utils/sampleSize";

extend("$sum", (point: number, original: number) => {
  return original + point;
});


const Container = styled.div`
  max-width: 1100px;
  display: flex;
  margin: 40px auto 0;
  flex-direction: column;
`;

type onDragFn = (arg: { toIndex: number; fromIndex: number }) => void;
type onCombineFn = (arg: {
  toIndex: number;
  fromIndex: number;
  toId: string;
  fromId: string;
}) => void;

type IResGame = {
  tour: number;
  res: string;
};

const defaultResGame = { tour: 1, res: "" };

function App() {
  const [teamsData, setTeamsData] = useState(ITEMS_DATA);
  const [resultsData, setResultsData] = useState(RESULTS_DATA);
  const [points, setPoints] = useState<{ [key: string]: number }>({});
  const clearPoints = () => setPoints({})
  const [resultGame, setResultGame] = useState<IResGame>(defaultResGame);
  const [activeTeams, setActiveTeams] = useState<ITeamItem[]>([]);
  const [restartTime, setRestartTime] = useState<null | number>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  
  const clearRes = () => {
    setResultGame((prev) => ({
      ...prev,
      res: "",
    }));
  };

  const setNewResGame = (res: string) => {
    timerRef.current && clearTimeout(timerRef.current);
    setResultGame((prev) => ({
      tour: prev.tour + 1,
      res,
    }));
    timerRef.current = setTimeout(clearRes, 4000);
  };
  const startNewTournament = () => {
    clearPoints()
    setTeamsData(ITEMS_DATA);
    setResultGame(defaultResGame);
  };

  useEffect(() => {
    const getActiveTeams = () =>
      sampleSize<string>(teamsData.teamIds, 2).map((id) => teamsData.items[id]);
    if (teamsData.teamIds.length < 2) {
      return;
    }
    setActiveTeams(getActiveTeams());
  }, [resultGame.tour, teamsData.teamIds.length]);

  useEffect(() => {
    const ids = teamsData.teamIds;
    const teamId = ids[0];
    if (ids.length !== 1) {
      return;
    }
    setResultsData((prev) => {
      let newObj = prev;
      const allPoints = { ...points, [teamId]: POINTS[1] };
      for (let key in allPoints) {
        const pointGame = allPoints[key]
        newObj = update<IResults, any>(newObj, {
          items: { [key]: {
            points: { $sum: pointGame },
            games: { $sum: 1 },
            qual: {$sum: pointGame ? 1 : 0},
            champion: {$sum: pointGame === POINTS[1] ? 1 : 0}
            }
          },
        });
      }
      return newObj;
    });
    let sec = 5;
    const now = performance.now() + sec * 1000;
    setRestartTime(now - performance.now());
    setActiveTeams([teamsData.items[ids[0]]]);
    const interval = setInterval(() => {
      setRestartTime(now - performance.now());
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setRestartTime(null);
      startNewTournament();
    }, sec * 1000);
  }, [teamsData.teamIds.length === 1]);

  const changeTeams: onDragFn = ({ toIndex, fromIndex }) => {
    setTeamsData((prev) => {
      const copyIds = [...prev.teamIds];
      const [removed] = copyIds.splice(fromIndex, 1);
      copyIds.splice(toIndex, 0, removed);
      return { ...prev, teamIds: copyIds };
    });
  };
  const combineTeams: onCombineFn = ({ toIndex, fromIndex, toId, fromId }) => {
    if (!activeTeams.every((team) => team.id === toId || team.id === fromId)) {
      return;
    }
    const res = Math.random();
    if (res >= 0.4 && res <= 0.6) {
      setNewResGame("Ничья");
      setResultsData((prev) => {
        const newData = update<IResults, any>(prev, {
          items: {
            [fromId]: { draw: { $sum: 1 } },
            [toId]: { draw: { $sum: 1 } },
          },
        });
        return newData;
      });
      return;
    }
    const isWinFrom = res < 0.5;
    const [winId, losId] = isWinFrom ? [fromId, toId] : [toId, fromId];
    const winTeam = teamsData.items[winId].content;
    setTeamsData((prev) => {
      const copyIds = [...prev.teamIds];
      copyIds.splice(fromIndex, 1);
      if (isWinFrom) {
        copyIds.splice(toIndex, 1, fromId);
      }
      return { ...prev, teamIds: copyIds };
    });
    setResultsData((prev) => {
      const newData = update<IResults, any>(prev, {
        items: {
          [winId]: { wins: { $sum: 1 } },
          [losId]: { losses: { $sum: 1 } },
        },
      });
      return newData;
    });
    setNewResGame(`Победа ${winTeam}`);
    setPoints((prev) => ({
      ...prev,
      [losId]: POINTS[teamsData.teamIds.length],
    }));
  };

  const onDragEnd: IDragEndFn = (result) => {
    const { destination, source, draggableId, combine } = result;
    if (!destination && !combine) return;
    const { index: fromIndex } = source;
    if (destination) {
      const { index: toIndex } = destination;
      changeTeams({ toIndex, fromIndex });
      return;
    }
    if (combine) {
      let toIndex = teamsData.teamIds.findIndex(
        (id) => id === combine.draggableId
      );
      toIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;
      combineTeams({
        toIndex,
        fromIndex,
        toId: combine.draggableId,
        fromId: draggableId,
      });
      return;
    }
  };

  return (
    <Container>
      <Flex justify="space-between">
        <DragDropContext onDragEnd={onDragEnd}>
          <Column
            teams={teamsData.teamIds.map((id) => teamsData.items[id])}
            activeTeams={activeTeams}
          />
        </DragDropContext>
        {activeTeams.length > 0 && (
          <Wrapper sticky center>
            {activeTeams.length === 2 ? (
              <>
                <Title size="21px" padding="10px 5px">
                  {resultGame.tour} тур. {activeTeams[0].content} -{" "}
                  {activeTeams[1].content}
                </Title>
                {!!resultGame.res && <SubTitle>{resultGame.res}</SubTitle>}
              </>
            ) : (
              <Title>Победитель - {activeTeams[0].content}</Title>
            )}
            {restartTime !== null && (
              <SubTitle>
                Новая игра через {Math.ceil(restartTime / 1000)} с.
              </SubTitle>
            )}
          </Wrapper>
        )}
        <Table resultsData={resultsData} />
      </Flex>
    </Container>
  );
}

export default App;
