// entities/record Public API. (MVP 문서 섹션 10.8)

export type { OddayRecord } from "./model/record";
export { getRecords, addRecord, clearRecords } from "./api/storage";
