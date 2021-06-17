import { getRandom } from "./getRandom";

export const sampleSize = <T,>(list: T[],size: number) => {
    const newList = [...list];
  
    return Array.from({
      length: size
    }, () => {
      const index = getRandom(0, newList.length);
      return newList.splice(index, 1)[0];
    });
}