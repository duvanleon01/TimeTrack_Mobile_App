import { AttendanceRepositoryImpl } from "../../../Data/repositories/AttendanceRepositoryImpl"; 

const { clockIn } = new AttendanceRepositoryImpl();

export const ClockInUseCase = async (userId: string) => {
    return await clockIn(userId);
};