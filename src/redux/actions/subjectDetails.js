import axios from "axios"
import apis from "../../services/Apis"
import { ActionTypes } from "../constants/action-types"
import Auth from "../../services/Auth"


export const getSubjectDetails = () => {
    return async(dispatch) => {
      axios.get(apis.BASE + apis.GET_SUBJECT_DETAILS, {
        headers : {
          'Authorization':`Bearer ${Auth.retriveToken()}`
        }
      }).then(response => {

        if(response.data.success) {
          dispatch({
            type: ActionTypes.GET_ALL_SUBJECT,
            payload : {
              subjectlist : response.data.subjects
            }
          })
        }
      })
    }
}

export const SubjectToggleStatus = (status,id) => {
  var apisuffix = status ? apis.REMOVE_SUBJECT : apis.UNBLOCK_SUBJECT;
  return async() => {
    await axios.post(apis.BASE + apisuffix,{
      _id : id
    },{
      headers:{
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    }).then(response => {
      if(response.data.success) {
        console.log(response.data);
        getSubjectDetails();
      } else {
        console.log(response.data);
      }
    })
  }
  
}

export const SubjectDelete = (id) => {
  return async (dispatch) => {
    // Optional confirmation logic here
    await axios
      .post(apis.BASE + apis.DELETE_SUBJECT, { // Update endpoint for deletion
        _id: id,
      }, {
        headers: {
          'Authorization':`Bearer ${Auth.retriveToken()}`
        },
      })
      .then((response) => {
        if (response.data.success) {
          // Dispatch action to update teacher list in Redux store (optional)
          // You can dispatch an action to fetch updated teacher data after deletion
          // dispatch({
          //   type: ActionTypes.GET_ALL_TEACHER,
          //   payload: {
          //     // Update teacher list after deletion
          //   },
          // });
          console.log("Subject deleted successfully!");
        } else {
          console.log(response.data);
        }
      });
  };
};