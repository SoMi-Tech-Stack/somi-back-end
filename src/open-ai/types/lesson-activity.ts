export interface LessonActivity {
  yearGroup: string;
  theme: string;
  piece: {
    title: string;
    composer: string;
    youtubeSearchQuery: string;
    details: {
      instruments: string[];
      yearComposed: string;
      about: string;
      sheetMusicUrl: string;
      wikipediaUrl: string;
    };
  };
  reason: string;
  questions: string[];
  teacherTip: string;
}
