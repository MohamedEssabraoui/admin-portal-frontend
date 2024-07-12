import axios from "axios"
import apis from "../../services/Apis"
import { ActionTypes } from "../constants/action-types"
import Auth from "../../services/Auth"


export const getTeacherDetails = () => {
    return async(dispatch) => {
      axios.get(apis.BASE + apis.GET_TEACHER_DETAILS, {
        headers : {
          'Authorization':`Bearer ${Auth.retriveToken()}`
        }
      }).then(response => {

        if(response.data.success) {
          dispatch({
            type: ActionTypes.GET_ALL_TEACHER,
            payload : {
              teacherlist : response.data.teachers
            }
          })
        }
      })
    }
}
//`${apis.BASE}${apis.GET_TEACHER}/${id}`,
// axios.get(apis.BASE + apis.GET_TEACHER,{ _id: id,},
export const getTeacher = (id) => {
  return async (dispatch) => {
    await axios
    .post(apis.BASE + apis.GET_TEACHER, { // Update endpoint for deletion
      _id: id,
    }, {
      headers: {
        'Authorization':`Bearer ${Auth.retriveToken()}`
      },
    })
    .then((response) => {
      if (response.data.success) {
        dispatch({
          type: ActionTypes.GET_TEACHER,
          payload: {
            teacherlist: response.data,
          },
        });
      } else {
        console.log(response.data);
      }
    });
  };
}


export const TeacherToggleStatus = (status,id,callback) => {
  var apisuffix = status ? apis.REMOVE_USER : apis.UNBLOCK_USER;
  return async() => {
    await axios.post(apis.BASE + apisuffix,{
      _id : id
    },{
      headers:{
        'Authorization':`Bearer ${Auth.retriveToken()}`
      }
    }).then(response => {
      if(response.data.success) {
        callback();
      } else {
        console.log(response.data);
      }
    })
  }

  
  
}

export const UserDelete = (id) => {
  return async (dispatch) => {
    // Optional confirmation logic here
    await axios
      .post(apis.BASE + apis.DELETE_USER, { // Update endpoint for deletion
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
          console.log("Teacher deleted successfully!");
        } else {
          console.log(response.data);
        }
      });
  };
};
