import { AttendanceRepositoryImpl } from "../../../Data/repositories/AttendanceRepositoryImpl";

const { findLastClockInByUserId } = new AttendanceRepositoryImpl();

export const FindLastClockInUseCase = async (userId: string) => {
    return await findLastClockInByUserId(userId);
};