import React, { useState } from "react";
import styled from "styled-components";
import { IResItem, IResults } from "../utils/constants";
import { TableHeadRow, TableRow } from "./TableRow";

interface TableProps {
  resultsData: IResults;
}

const StyledTable = styled.table`
  & *:not(b, button) {
    border: 1px solid black;
  }
  border-collapse: collapse;
  position: sticky;
  top: 10px;
`;

export type ICompProps = keyof Omit<IResItem, "id">
// 1 - по возрастанию
// -1 - по убывания
type ICompState = [ICompProps, 1 | -1]


function getDiff(a: string | number, b: string | number): number {
  //@ts-ignore
  return typeof a === "number" ? (a - b) : (a.localeCompare(b))
}


export const Table: React.FC<TableProps> = ({ resultsData }) => {
  const getItem = (id: string) => resultsData.items[id];
  const sortByProp = ([prop, dir]: ICompState) => (a: string, b: string) => {
    const [itemA, itemB] = [a, b].map(getItem)
    return (dir * getDiff(itemA[prop], itemB[prop])) || (dir * (itemA.points - itemB.points)) || (dir * (itemA.wins - itemB.wins)) || (itemA.content.localeCompare(itemB.content))
  }


  const [compareProp, setCompareProp] = useState<ICompState>(["points", -1])


  const onClickCompare = (prop: ICompProps) => () => {
    setCompareProp(([prevProp,prevDir]) => {
      if (prevProp === prop) {
        return [prevProp, (prevDir * -1) as -1 | 1]
      }
      return [prop, prevDir]
    })
  }
  const results = Array.from(resultsData.teamIds).sort(sortByProp(compareProp));
  
  return (
    <StyledTable>
      <thead>
        <TableHeadRow
          onClickCompare={onClickCompare}
          data={{
            content: "Название",
            position: "№",
            wins: "В",
            draw: "Н",
            losses: "П",
            points: "Очки",
            qual: "Бал.",
            champion: "Чемп."
          }}
        />
      </thead>
      <tbody>
        {results.map((id, i) => {
          const { content, wins, losses, points, champion, qual, draw } = resultsData.items[id];
          return (
            <TableRow
              data={{ content, wins, losses, points, position: i + 1, champion, qual, draw }}
              key={id}
            />
          );
        })}
      </tbody>
    </StyledTable>
  );
};
