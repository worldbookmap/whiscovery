export const DATABASE_BOXES = [
  {
    key: "db-1",
    title: "기록들: 정모",
    id: "7082376c-7a1f-43dd-82b8-d9954a2f6842",
    titleProperty: "제목",
    filterProperty: "태그",
    filterLabel: "태그",
    fields: [
      { key: "leader", label: "정모리더", property: "정모 리더" },
      { key: "text", label: "텍스트", property: "텍스트" },
      { key: "date", label: "Date", property: "Date" },
      { key: "tags", label: "태그", property: "태그" },
    ],
  },
  {
    key: "db-3",
    title: "기록들: 벙",
    id: "a35700bb-3606-4bfa-907a-c4ccddaed491",
    titleProperty: "제목",
    filterProperty: "태그",
    filterLabel: "태그",
    fields: [
      { key: "participants", label: "참가자", property: "참가자" },
      { key: "date", label: "Date", property: "Date" },
    ],
  },
  {
    key: "db-4",
    title: "매일매일술하나",
    id: "2a0fccab-745a-4062-a589-8ed229e022d8",
    titleProperty: "위스키명",
    filterProperty: "원산지",
    filterLabel: "원산지",
    fields: [
      { key: "kind", label: "술 종류", property: "술종류" },
      { key: "origin", label: "원산지", property: "원산지" },
    ],
  },
  {
    key: "db-2",
    title: "Bar",
    id: "36d58bae-bedd-446a-9821-8a0282e150f6",
    titleProperty: "바 목록",
    filterProperty: "종류",
    filterLabel: "종류",
    fields: [
      { key: "participants", label: "참여자", property: "참여자" },
      { key: "kind", label: "종류", property: "종류" },
    ],
  },
];

export const getCollectionByKey = (key) => {
  return DATABASE_BOXES.find((collection) => collection.key === key);
};