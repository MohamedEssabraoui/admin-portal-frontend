import React from "react"
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Alert from "../../../services/alert";
import Auth from "../../../services/Auth";
import { getAdminDetails } from "../../../redux/actions/loginAction";
import { getDashboardCount } from "../../../redux/actions/dashboardDetails";
import { getTeacherDetails } from "../../../redux/actions/teacherDetails";
import "./AddSubject.css"
import axios from "axios";
import apis from "../../../services/Apis";

class AddSubject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name : ""
    }
  }

  nameInputHandler = (event)=>{
    this.setState({
      ...this.state,
      name : event.target.value
    });
  }

  handleBack= (event) => {
    this.props.getTeacherDetails();
    this.props.getDashboardCount();
    }
  
  handleSubmit= (event) => {
    event.preventDefault();
    
    axios.post(apis.BASE + apis.ADD_SUBJECT, {
      name : this.state.name
    },{
      headers:{
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    }).then(response => {
      if(response.data.success) {
        Alert('info','Success',response.data.message);
      } else {
        Alert('error','Failed',response.data.message);
      }
    })
  }

  render(){
      if(!Auth.retriveToken() || Auth.retriveToken()==='undefined'){
      return (<Navigate to='/'/>);
    } else if(!this.props.user.isLoggedIn) {
      this.props.getAdminDetails();
      return (<div></div>)
    }
    return (
      
      <form onSubmit={this.handleSubmit} className="form-class">
        <h2>Add Subjects</h2>
        <div>
          <label htmlFor="name"> Name </label>
          <input id="name" type='Text' value={this.state.name} onChange={this.nameInputHandler} required/>
        </div>
        
        <button type="submit"> Add Subject</button>
        <br/>
        <Link className="linkbtn" onClick={this.handleBack} to={{pathname:`/`}}>Back</Link>
      </form>
    )
  }
}

const mapStateToProps = state => ({
  user:state.user
});

export default connect(mapStateToProps,{
  getAdminDetails,
  getDashboardCount,
  getTeacherDetails
})(AddSubject);