interface ChapterPart {
  id: string;
  title: string;
  isSelected?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  parts: ChapterPart[];
}
