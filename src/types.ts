import { DragUpdate, DropResult, ResponderProvided } from "react-beautiful-dnd";

export type IDragEndFn = (result: DropResult, provided: ResponderProvided) => void
export type IDragUpdateFn = (initial: DragUpdate, provided: ResponderProvided) => void