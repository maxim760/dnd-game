import { v4 as uuid } from "uuid";
export type ITeamItem = { id: string; content: string };
export type IResItem = ITeamItem &
  Record<"losses" | "wins" | "points" | "draw" |  "champion" | "qual", number>;
export type IData = {
  items: {
    [key: string]: ITeamItem;
  };
  teamIds: string[];
};

export type IResults = Pick<IData, "teamIds"> & {
  items: {
    [key: string]: IResItem;
  };
};

const TEAMS = [
  "МС",
  "МЮ",
  "Ливерпуль",
  "Челси",
  "Лестер",
  "Вест Хэм",
  "Тоттенхэм",
  "Арсенал",
  "Лидс",
  "Эвертон",
  "Астон Вилла",
  "Ньюкасл",
  "Вулверхэмптон",
  "Кристал Пэлас",
  "Саутгемптон",
  "Брайтон",
  "Бёрнли",
  "Норвич",
  "Уотфорд",
  "Брентфорд"
];
const ids = Array.from({ length: TEAMS.length }, () => uuid());
const TEAM_ITEMS: ITeamItem[] = TEAMS.map((team, i) => ({
  content: team,
  id: ids[i],
}));

export const ITEMS_DATA: IData = {
  items: TEAM_ITEMS.reduce((acc, value) => ({ ...acc, [value.id]: value }), {}),
  teamIds: ids,
};

export const RESULTS_DATA: IResults = {
  items: TEAM_ITEMS.reduce(
    (acc, value) => ({
      ...acc,
      [value.id]: {
        ...value,
        wins: 0,
        losses: 0,
        points: 0,
        qual: 0,
        draw: 0,
        champion: 0,
      },
    }),
    {}
  ),
  teamIds: ids,
};


const pointsObj: { [key: number]: number } = {
  1: 15,
  2: 12,
  3: 10,
  4: 8,
  5: 6,
  6: 5,
  7: 4,
  8: 3,
  9: 2,
  10: 1,
};

export const POINTS: { [key: number]: number } = new Proxy(pointsObj, {
  get(target, prop) {
    return target[prop as any] || 0;
  },
});