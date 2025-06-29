import { AttendanceRepositoryImpl } from "../../../Data/repositories/AttendanceRepositoryImpl";

const { getRecordsByUserId } = new AttendanceRepositoryImpl();

export const FindRecordsByUserIdUseCase = async (userId: string) => {
    return await getRecordsByUserId(userId);
};