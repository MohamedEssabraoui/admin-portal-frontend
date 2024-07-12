import React from "react"
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Alert from "../../../services/alert";
import Auth from "../../../services/Auth";
import { getAdminDetails } from "../../../redux/actions/loginAction";
import { getTeacherDetails } from "../../../redux/actions/teacherDetails";
import { getDashboardCount } from "../../../redux/actions/dashboardDetails";
import "./AddTeacher.css"
import axios from "axios";
import apis from "../../../services/Apis";



class AddTeacher extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name : "",
      email : "",
      password : "",
      confirmpassword : "",
    };
  }

  nameInputHandler = (event)=>{
    this.setState({
      ...this.state,
      name : event.target.value
    });
  }

  emailInputHandler = (event)=> {
    this.setState({
      ...this.state,
      email : event.target.value
    })
  }

  passwordInputHandler = (event)=> {
    this.setState({
      ...this.state,
      password : event.target.value
    })
  }

  confirmInputHandler = (event)=> {
    this.setState({
      ...this.state,
      confirmpassword : event.target.value
    })
  }

  handleBack= (event) => {
    this.props.getTeacherDetails();
    this.props.getDashboardCount();
    }
  
  handleSubmit= (event) => {
    event.preventDefault();
      if (this.state.confirmpassword !== this.state.password) {
        Alert("error", "Invalid Input", "Confirm Password does not match");
        return;
      }
      axios.post(apis.BASE + apis.ADD_TEACHER, {
        username: this.state.name,
        email: this.state.email,
        password: this.state.password,
      }, {
        headers: {
          Authorization: `Bearer ${Auth.retriveToken()}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          Alert("info", "Success", response.data.message);
        } else {
          Alert("error", "Failed", response.data.message);
        }
      });

  };

  render(){
     if(!Auth.retriveToken() || Auth.retriveToken()==='undefined'){
      return (<Navigate to='/'/>);
    } else if(!this.props.user.isLoggedIn) {
      this.props.getAdminDetails();
      return (<div></div>)
    } 
    return (
      
      <form onSubmit={this.handleSubmit} className="form-class" ref={this.formRef}>
      <h2>Teacher Management</h2>
        

      <div>
        <label htmlFor="name"> Name </label>
        <input id="name" type='Text' value={this.state.name} onChange={this.nameInputHandler} autoComplete="username" required/>
      </div>
      <div>
        <label htmlFor="email"> Email </label>
        <input id="email" type='email' value={this.state.email} onChange={this.emailInputHandler} autoComplete="email" required/>
      </div>
      <div>
        <label htmlFor="password"> Password </label>
        <input id="password" type='password' value={this.state.password} onChange={this.passwordInputHandler} autoComplete="password" required/>
      </div>
      <div>
        <label htmlFor="confirm PW"> Confirm PW </label>
        <input id="confirm PW" type='password' value={this.state.confirmpassword} onChange={this.confirmInputHandler} autoComplete="confirmpassword" required/>
      </div>
      <div className="button-container">
          <button type="submit">Add Teacher</button>
          <Link className="linkbtn" onClick={this.handleBack} to={{pathname:`/`}}>Back</Link>
      </div>
    </form> 


    )
  }
}

const mapStateToProps = state => ({
  user:state.user
});

export default connect(mapStateToProps,{
  getAdminDetails,
  getTeacherDetails,
  getDashboardCount
})(AddTeacher);