import { AttendanceRepositoryImpl } from "../../../Data/repositories/AttendanceRepositoryImpl";

const { deleteRecord } = new AttendanceRepositoryImpl();

export const DeleteRecordUseCase = async (recordId: number, userId: string) => {
    return await deleteRecord(recordId, userId);
};