import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDetails, StudentToggleStatus, UserDelete } from "../../../redux/actions/studentDetails";
//import './studentTable.css';
import { getDashboardCount } from "../../../redux/actions/dashboardDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  tableBorder: {
    background: "#e7e7e7",
    padding: "15px",
  },
  tableHeader: {
    background: "#3f51b5",
    color: "white",
  },
}));

const StudentTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const studentList = useSelector((state) => state.students.list);
  const studentretrived = useSelector((state) => state.students.retrived); 
  const [updatedStudentList, setUpdatedStudentList] = useState(studentList);


  useEffect(() => {
    //dispatch(getStudentDetails())
     if(studentretrived===false) {
       dispatch(getStudentDetails());
    } 
    setUpdatedStudentList(studentList);
  }, [studentList,dispatch,studentretrived]);

  const handleStatusChange = (event, status, id) => {
    console.log(status, id)
    dispatch(StudentToggleStatus(status, id));
    setUpdatedStudentList(updatedStudentList.map((student)=> {
      if(student.id === id){ return { ...student, status: !status }  }else {
        return student;
      }}));
  };

  const handleDelete = async (id) => {
    await dispatch(UserDelete(id));
    await dispatch(getDashboardCount());
    setUpdatedStudentList(updatedStudentList.filter((student) => student.id !== id));
  };


   return (

    <div className={classes.tableBorder}>
      <TableContainer component={Paper} className={classes.table}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>No.</TableCell>
              <TableCell align="left" className={classes.tableHeader}>
                Name
              </TableCell>
              <TableCell className={classes.tableHeader}>Status</TableCell>
              <TableCell className={classes.tableHeader}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updatedStudentList.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell >
                  {student.name}
                </TableCell>
                <TableCell
                  style={{ color: student.status ? "green" : "red" }}
                >
                  {student.status ? "Active" : "Blocked"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={(event) =>
                      handleStatusChange(event, student.status, student.id)
                    }
                    style={{
                      background: student.status ? "#00ff0088" : "#eaf248",
                    }}
                  >
                    {student.status ? "Block" : "Unblock"}
                  </Button>
                  
                  <Button 
                    onClick={() => handleDelete(student.id)}
                    style={{ background: "#ff0000aa",marginLeft:"5px" }}
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

  ); 
};

export default StudentTable;


/* import { connect } from "react-redux"
import React from "react";
import {getStudentDetails, StudentToggleStatus,UserDelete}  from "../../../redux/actions/studentDetails";
import './studentTable.css'


class StudentTable extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    handleStatusChange(status, id) {
      this.props.StudentToggleStatus(status,id,this.props.getStudentDetails);
    }

    handleDelete(id) {
      this.props.UserDelete(id);
    }

    buttonTextBasedOnStatus(status) {
      if(status === true) {
        return("block");
      } else {
        return("unblock");
      }
    }

    render(){
      if(this.props.students.retrived===false) {
        this.props.getStudentDetails();
        return (<div>Collecting data</div>);
      }

      return (
      <div className="main">
        <h2 className="title">Students</h2> 
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {this.props.students.list.map((val,key)=>{
            return (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.status.toString()}</td>
                <td>
                  <button onClick={()=>(this.handleStatusChange(val.status,val.id))}>{this.buttonTextBasedOnStatus(val.status)}</button>
                  <button onClick={()=>(this.handleDelete(val.id))}>Delete</button>
                  </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>)
    }
}

const mapStateToProps = state => ({
  students : state.students
});

export default connect(mapStateToProps,{
  getStudentDetails,
  StudentToggleStatus,
  UserDelete
})(StudentTable);  */