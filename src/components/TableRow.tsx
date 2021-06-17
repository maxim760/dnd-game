import React from "react";
import styled, { css } from "styled-components";
import { IResItem } from "../utils/constants";
import { ICompProps } from "./Table";

type CellProps = {
  center?: boolean;
  bold?: boolean;
};

const Cell = styled.td<CellProps>`
  padding: 2px 8px;
  ${({ center }) =>
    center &&
    css`
      text-align: center;
    `}
  ${({ bold }) =>
    bold &&
    css`
      font-weight: 700;
    `}
`;
const HeadCell = styled(Cell).attrs({ as: "th", center: true })`
  padding: 0;
  & button {
    padding: 2px 8px;
  }
`;
type IRowData = Omit<IResItem, "id"> & { position: number };

type IHeadData = Record<keyof IRowData, string>;
type TableRowProps = {
  data: Omit<IResItem, "id"> & { position: number };
};
type TableHeadRowProps = {
  data: IHeadData;
  onClickCompare: (prop: ICompProps) => () => void;
};

const cells: { name: ICompProps; opts?: CellProps }[] = [
  { name: "content" },
  { name: "wins" },
  { name: "draw" },
  { name: "losses" },
  { name: "points", opts: { bold: true, center: true } },
  { name: "champion", opts: { bold: true, center: true } },
  { name: "qual", opts: { center: true } },
];
export const TableRow: React.FC<TableRowProps> = ({ data }) => {
  return (
    <tr>
      <Cell>{data.position}</Cell>
      {cells.map(({ name, opts = {} }) => (
        <Cell key={name} {...opts}>
          {data[name]}
        </Cell>
      ))}
    </tr>
  );
};

export const TableHeadRow: React.FC<TableHeadRowProps> = ({
  data,
  onClickCompare,
}) => {
  return (
    <tr>
      <HeadCell>{data.position}</HeadCell>
      {cells.map(({ name, opts = {} }) => (
        <HeadCell key={name} {...opts}>
          <button onClick={onClickCompare(name)}>{data[name]}</button>
        </HeadCell>
      ))}
    </tr>
  );
};
