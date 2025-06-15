const attendanceController = require('../controllers/attendanceController');

module.exports = (app) => {
    app.post('/api/attendance/clockIn', attendanceController.clockIn);
    app.post('/api/attendance/clockOut', attendanceController.clockOut);
    app.get('/api/attendance/user/:userId', attendanceController.getRecordsByUserId);
    app.get('/api/attendance/getAll', attendanceController.getAllRecords);
    app.put('/api/attendance/updateTimestamp', attendanceController.updateRecordTimestamp);
    app.post('/api/attendance/deleteRecord', attendanceController.deleteRecord); 
};