import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectDetails, SubjectToggleStatus, SubjectDelete } from "../../../redux/actions/subjectDetails";
import { getDashboardCount } from "../../../redux/actions/dashboardDetails";
//import './subjectTable.css'; // Assuming the CSS file exists
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

const SubjectTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const subjectList = useSelector((state) => state.subjects.list);
  const subjectsRetrieved = useSelector((state) => state.subjects.retrived);
  const [updatedSubjectList, setUpdatedSubjectList] = useState(subjectList);

  useEffect(() => {
    if (subjectsRetrieved === false) {
      
      dispatch(getSubjectDetails());
    }
    setUpdatedSubjectList(subjectList); // Update local state on initial render or list change
  }, [subjectList, dispatch, subjectsRetrieved]);

  const handleStatusChange = (event, status, id) => {
    console.log(status, id);
    dispatch(SubjectToggleStatus(status, id));
    setUpdatedSubjectList(updatedSubjectList.map((subject) =>
      subject.id === id ? { ...subject, status: !status } : subject
    ));
  };

  const handleDelete = async (id) => {
    await dispatch(SubjectDelete(id));
    await dispatch(getDashboardCount());
    setUpdatedSubjectList(updatedSubjectList.filter((subject) => subject.id !== id));
  };


  return (

    <div className={classes.tableBorder}>
      <TableContainer component={Paper} className={classes.table}>
      <h2 className="title">Subjects</h2>
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
            {updatedSubjectList.map((subject, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell >
                  {subject.subject}
                </TableCell>
                <TableCell
                  style={{ color: subject.status ? "green" : "red" }}
                >
                  {subject.status ? "Active" : "Blocked"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={(event) =>
                      handleStatusChange(event, subject.status, subject.id)
                    }
                    style={{
                      background: subject.status ? "#00ff0088" : "#eaf248",
                    }}
                  >
                    {subject.status ? "Block" : "Unblock"}
                  </Button>
                  
                  <Button 
                    onClick={() => handleDelete(subject.id)}
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
      <h2 className="title">Subjects</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {updatedSubjectList.map((subject, index) => (
            <tr key={index}>
              <td>{subject.subject}</td>
              <td style={{ color: subject.status ? "green" : "red" }}>
                {subject.status ? "Active" : "Blocked"}
              </td>
              <td>
                <button
                  onClick={(event) =>
                    handleStatusChange(event, subject.status, subject.id)
                  }
                  style={{
                    background: subject.status ? "#00ff0088" : "#eaf248",
                  }}
                >
                  {buttonTextBasedOnStatus(subject.status)}
                </button>
                <button onClick={() => handleDelete(subject.id)} style={{ background: "#ff0000aa", marginLeft: "5px" }}>
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

export default SubjectTable;

/* import { connect } from "react-redux"
import React from "react";
import {getSubjectDetails, SubjectToggleStatus,SubjectDelete}  from "../../../redux/actions/subjectDetails";
import './subjectTable.css'


class SubjectTable extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    handleStatusChange(status, id) {
      this.props.SubjectToggleStatus(status,id,this.props.getSubjectDetails);
    }

    handleDelete(id) {
      this.props.SubjectDelete(id);
    }

    buttonTextBasedOnStatus(status) {
      if(status === true) {
        return("block");
      } else {
        return("unblock");
      }
    }

    render(){
      if(this.props.subjects.retrived===false) {
        this.props.getSubjectDetails();
        return (<div>Collecting data</div>);
      }

      return (
      <div className="main">
        <h2 className="title">Subjects</h2> 
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {this.props.subjects.list.map((val,key)=>{
            return (
              <tr key={key}>
                <td>{val.subject}</td>
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
  subjects : state.subjects
});

export default connect(mapStateToProps,{
  getSubjectDetails,
  SubjectToggleStatus,
  SubjectDelete
})(SubjectTable); */