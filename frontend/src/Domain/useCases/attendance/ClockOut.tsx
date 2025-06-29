import { AttendanceRepositoryImpl } from "../../../Data/repositories/AttendanceRepositoryImpl";

const { clockOut } = new AttendanceRepositoryImpl();

export const ClockOutUseCase = async (userId: string) => {
    return await clockOut(userId);
};