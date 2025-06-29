import { AttendanceRepositoryImpl } from "../../../Data/repositories/AttendanceRepositoryImpl";

const { findAllRecords } = new AttendanceRepositoryImpl();

export const FindAllRecordsUseCase = async () => {
    return await findAllRecords();
};