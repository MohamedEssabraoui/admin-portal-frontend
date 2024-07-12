import { combineReducers } from "redux";
import { dashBoardCountReducer } from "./counts";
import { loginUserReducer } from "./login";
import { getAllStudentReducer } from "./studentDetails";
import { getAllSubjectsReducer } from "./subjectDetails";
import { getAllTeachersReducer,getTeacherReducer } from "./teacherDetails";

export default combineReducers({
  user : loginUserReducer,
  dashboardDetails : dashBoardCountReducer,
  teachers : getAllTeachersReducer,
  teacher : getTeacherReducer,
  students : getAllStudentReducer,
  subjects : getAllSubjectsReducer
});