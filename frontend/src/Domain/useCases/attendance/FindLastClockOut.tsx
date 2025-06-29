import { AttendanceRepositoryImpl } from "../../../Data/repositories/AttendanceRepositoryImpl";

const { findLastClockOutByUserId } = new AttendanceRepositoryImpl();

export const FindLastClockOutUseCase = async (userId: string) => {
    return await findLastClockOutByUserId(userId);
};