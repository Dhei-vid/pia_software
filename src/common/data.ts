import { Chapter } from "./types";

export const chapters: Chapter[] = [
  {
    id: "1",
    title: "Chapter 1 Governance & Institution",
    description: "description lorem possum possum possum",
    isExpanded: false,
    parts: [
      { id: "1-1", title: "Part I - General Provisions" },
      { id: "1-2", title: "Part II - Petroleum Industry Commission" },
      { id: "1-3", title: "Part III - Host Communities Development Trust" },
    ],
  },
  {
    id: "2",
    title: "Chapter 2 Administration",
    description: "description lorem possum possum possum",
    isExpanded: true,
    parts: [
      { id: "2-1", title: "Part I - General Administration" },
      {
        id: "2-2",
        title:
          "Part II - Administration of Upstream Petroleum Operations and Environment",
        isSelected: true,
      },
      {
        id: "2-3",
        title: "Part III - General Administration of Midstream Operations",
      },
      {
        id: "2-4",
        title: "Part IV - Administration of Downstream Operations",
      },
      { id: "2-5", title: "Part V - Administration of Gas Flaring" },
      {
        id: "2-6",
        title: "Part VI - Other Matters Relating to Administration",
      },
      { id: "2-7", title: "Part VII - Common Provisions" },
    ],
  },
  {
    id: "3",
    title: "Chapter 3 Host Communities Development",
    description: "description lorem possum possum possum",
    isExpanded: false,
    parts: [
      { id: "3-1", title: "Part I - Host Communities Development Trust" },
      {
        id: "3-2",
        title: "Part II - Host Communities Development Trust Fund",
      },
    ],
  },
  {
    id: "4",
    title: "Chapter 4 Petroleum Industrial Fiscal Framework",
    description: "description lorem possum possum possum",
    isExpanded: false,
    parts: [
      { id: "4-1", title: "Part I - General Provisions" },
      { id: "4-2", title: "Part II - Royalties" },
      { id: "4-3", title: "Part III - Petroleum Profits Tax" },
    ],
  },
  {
    id: "5",
    title: "Chapter 5 Miscellaneous Provisions",
    description: "description lorem possum possum possum",
    isExpanded: false,
    parts: [
      { id: "5-1", title: "Part I - General Provisions" },
      { id: "5-2", title: "Part II - Transitional Provisions" },
    ],
  },
];
