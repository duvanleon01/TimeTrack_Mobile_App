import { AttendanceRepositoryImpl } from "../../../Data/repositories/AttendanceRepositoryImpl";

const { updateTimestamp } = new AttendanceRepositoryImpl();

export const UpdateTimestampUseCase = async (recordId: number, newTimestamp: string, userId: string) => {
    return await updateTimestamp(recordId, newTimestamp, userId);
};