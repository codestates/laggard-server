export interface TestData {
  id: number;
  title: string;
  artist: string;
  year: number;
  genre: string;
  lyrics: string;
}

export interface AnswerSheet {
  tests_id: number;
  id: number;
  title: string;
  year: number;
  genre: string;
  userAnswer: string;
  right_or_wrong: boolean;
}

interface ScoreSheet {
  correct?: number;
  total?: number;
  correct_answer_rate?: number;
}

export interface GenreScoreTable {
  D: ScoreSheet;
  O: ScoreSheet;
  H: ScoreSheet;
  B: ScoreSheet;
}

// export interface Quota {
//   first: number;
//   second: number;
//   third: number;
// }
