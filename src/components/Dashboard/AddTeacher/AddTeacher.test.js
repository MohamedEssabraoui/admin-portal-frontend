import React from "react";
import { render, screen, fireEvent,waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Navigate } from "react-router-dom";
import AddTeacher from "./AddTeacher";
import { getAdminDetails } from "../../../redux/actions/loginAction";
import { getDashboardCount } from "../../../redux/actions/dashboardDetails";
import { getTeacherDetails } from "../../../redux/actions/teacherDetails";
import Auth from "../../../services/Auth";
import axios from "axios";
import apis from "../../../services/Apis";
import Alert from "../../../services/alert";

jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => null),
  Link: jest.fn(({ children, onClick }) => <a onClick={onClick}>{children}</a>),
}));

jest.mock("../../../redux/actions/loginAction", () => ({
    getAdminDetails: jest.fn(() => {
      return (dispatch) => {
        dispatch({ type: 'GET_ADMIN_DETAILS' });
      };
    }),
  }));
  jest.mock("../../../redux/actions/dashboardDetails", () => ({
    getDashboardCount: jest.fn(() => {
      return (dispatch) => {
        dispatch({ type: 'GET_DASHBOARD_COUNT' });
      };
    }),
  }));
  
  jest.mock("../../../redux/actions/teacherDetails", () => ({
    getTeacherDetails: jest.fn(() => {
      return (dispatch) => {
        dispatch({ type: 'GET_TEACHER_DETAILS' });
      };
    }),
  }));

jest.mock("axios");
jest.mock("../../../services/alert");
jest.mock("../../../services/Auth", () => ({
  retriveToken: jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState = {
  user: {
    isLoggedIn: false,
  },
};

const renderWithRedux = (component, { initialState, store = mockStore(initialState) } = {}) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("AddTeacher Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    Auth.retriveToken.mockReturnValue('some-token');
  });

  test("renders AddTeacher component correctly", () => {
    renderWithRedux(<AddTeacher />);
    expect(screen.getByText('Teacher Management')).toBeInTheDocument();
  });

  test("dispatches getAdminDetails if user is not logged in", () => {
    renderWithRedux(<AddTeacher />, { store });
    expect(getAdminDetails).toHaveBeenCalled();
  });

  test("updates name, email, password, and confirm password on change", () => {
    renderWithRedux(<AddTeacher />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm PW/i), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
    expect(screen.getByLabelText(/confirm PW/i)).toHaveValue('password123');
  });

  test("dispatches getTeacherDetails and getDashboardCount on back link click", () => {
    renderWithRedux(<AddTeacher />, { store });

    fireEvent.click(screen.getByText('Back'));

    expect(getTeacherDetails).toHaveBeenCalled();
    expect(getDashboardCount).toHaveBeenCalled();
  });

  test("handles form submission with matching passwords", async () => {
    axios.post.mockResolvedValue({ data: { success: true, message: 'Profile created successfully!' } });

    renderWithRedux(<AddTeacher />, { store });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm PW/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Add Teacher'));
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
        `${apis.BASE}${apis.ADD_TEACHER}`,
        {
            username: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        },
        { headers: { Authorization: `Bearer some-token` } }
        );


    expect(Alert).toHaveBeenCalledWith('info', 'Success', 'Profile created successfully!');
    });
  });
 
  test("handles form submission with non-matching passwords", () => {
    renderWithRedux(<AddTeacher />, { store });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm PW/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByText('Add Teacher'));

    expect(Alert).toHaveBeenCalledWith("error", "Invalid Input", "Confirm Password does not match");
  });

});