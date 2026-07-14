// entities/record 를 위한 교차 참조 전용 Public API. (fsd-concepts §6)
// record 는 완료한 퀘스트의 카테고리를 저장하므로 quest 의 Category 타입만 노출한다.

export type { Category } from "../model/quest";
