import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getTeacherDetails,
  TeacherToggleStatus,
  UserDelete,
  getTeacher,
} from "../../../redux/actions/teacherDetails";
import { getDashboardCount } from "../../../redux/actions/dashboardDetails";
//import './teacherTable.css'; // Assuming the CSS file exists
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

const TeacherTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const teacherList = useSelector((state) => state.teachers.list);
  const teachersRetrieved = useSelector((state) => state.teachers.retrived);
  const [updatedTeacherList, setUpdatedTeacherList] = useState(teacherList);
  const navigate = useNavigate(); // Utilize useNavigate for routing

  useEffect(() => {
    if (teachersRetrieved === false) {
      dispatch(getTeacherDetails());
    }
    setUpdatedTeacherList(teacherList); // Update local state on initial render or list change
  }, [teacherList, dispatch, teachersRetrieved]);

  const handleStatusChange = (event, status, id) => {
    console.log(status, id);
    dispatch(TeacherToggleStatus(status, id));
    setUpdatedTeacherList(updatedTeacherList.map((teacher) =>
      teacher.id === id ? { ...teacher, status: !status } : teacher
    ));
  };

  const handleDelete = async (id) => {
    await dispatch(UserDelete(id));
    await dispatch(getDashboardCount());
    setUpdatedTeacherList(updatedTeacherList.filter((teacher) => teacher.id !== id));
  };

  const handleEdit = (id) => {
    dispatch(getTeacher(id)); // Dispatch action to fetch details before editing
    navigate(`/EditTeacher`); // Use useNavigate for dynamic routing with id
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
            {updatedTeacherList.map((teacher, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell >
                  {teacher.name}
                </TableCell>
                <TableCell
                  style={{ color: teacher.status ? "green" : "red" }}
                >
                  {teacher.status ? "Active" : "Blocked"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={(event) =>
                      handleStatusChange(event, teacher.status, teacher.id)
                    }
                    style={{
                      background: teacher.status ? "#00ff0088" : "#eaf248",
                    }}
                  >
                    {teacher.status ? "Block" : "Unblock"}
                  </Button>
                  <Button 
                    onClick={() => handleEdit(teacher.id)}
                    style={{ background: "#3f51b5",marginLeft:"5px" }}
                  ><Link to={`/EditTeacher/${teacher.id}`}>Edit</Link>
                  </Button>
                  <Button 
                    onClick={() => handleDelete(teacher.id)}
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

/*     <div className="main">
      <h2 className="title">Teachers : </h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {updatedTeacherList.map((teacher, index) => (
            <tr key={index}>
              <td>{teacher.name}</td>
              <td style={{ color: teacher.status ? "green" : "red" }}>
                {teacher.status ? "Active" : "Blocked"}
              </td>
              <td>
                <button
                  onClick={(event) =>
                    handleStatusChange(event, teacher.status, teacher.id)
                  }
                  style={{
                    background: teacher.status ? "#00ff0088" : "#eaf248",
                  }}
                >
                  {buttonTextBasedOnStatus(teacher.status)}
                </button>
                <button onClick={() => handleEdit(teacher.id)}>
                  <Link to={`/EditTeacher/${teacher.id}`}>Edit</Link>
                </button>
                <button onClick={() => handleDelete(teacher.id)} style={{ background: "#ff0000aa", marginLeft: "5px" }}>
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div> */
  );
};

export default TeacherTable;



/* import { connect } from "react-redux"
import React from "react";
import { Link} from "react-router-dom";
import {getTeacherDetails, TeacherToggleStatus,UserDelete,getTeacher}  from "../../../redux/actions/teacherDetails";
import './teacherTable.css'


class TeacherTable extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
      }
    }

    handleStatusChange(status, id) {
      this.props.TeacherToggleStatus(status,id,this.props.getTeacherDetails);
    }

    handleDelete(id) {
      this.props.UserDelete(id);
    }

    handleEdit(id) {
      this.props.getTeacher(id)
    } 


    buttonTextBasedOnStatus(status) {
      if(status === true) {
        return("block");
      } else {
        return("unblock");
      }
    }

    render(){
      if(this.props.teachers.retrived===false) {
        this.props.getTeacherDetails();
    
        
        return (<div>Collecting data</div>);
      }
      
      return (
      <div className="main">
        <h2 className="title">Teachers : </h2> 
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {this.props.teachers.list.map((val,key)=>{

            return (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.status.toString()}</td>
                <td>
                  <button onClick={()=>(this.handleStatusChange(val.status,val.id))}>{this.buttonTextBasedOnStatus(val.status)}</button>
                  <button onClick={()=>(this.handleEdit(val.id))}><Link to={{pathname:`/EditTeacher/`}}>Edit</Link></button>
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
  teachers : state.teachers,
  teacher : state.teacher
});

export default connect(mapStateToProps,{
  getTeacherDetails,
  TeacherToggleStatus,
  UserDelete,
  getTeacher
})(TeacherTable); */