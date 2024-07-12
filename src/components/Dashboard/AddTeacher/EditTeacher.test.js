import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Navigate } from "react-router-dom";
import EditTeacher from "./EditTeacher";
import { getAdminDetails } from "../../../redux/actions/loginAction";
import { getTeacherDetails } from "../../../redux/actions/teacherDetails";
import axios from "axios";
import Alert from "../../../services/alert";
import Auth from "../../../services/Auth";
import apis from "../../../services/Apis";

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
    isLoggedIn: true,
  },
  teacher: {
    retrived: true,
    list: {
      teacher: {
        _id: '123',
        username: 'John Doe',
        email: 'john@example.com',
      },
    },
  },
};

const renderWithRedux = (component, { initialState, store = mockStore(initialState) } = {}) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("EditTeacher Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    Auth.retriveToken.mockReturnValue('some-token');
  });

  test("renders EditTeacher component correctly", () => {
    renderWithRedux(<EditTeacher />);
    expect(screen.getByText('Teacher Management:')).toBeInTheDocument();
  });

  test("navigates to '/' if no token", () => {
    Auth.retriveToken.mockReturnValue(null);
    renderWithRedux(<EditTeacher />);
    expect(Navigate).toHaveBeenCalledWith({ to: '/' }, {});
  });

  test("dispatches getAdminDetails if user is not logged in", () => {
    renderWithRedux(<EditTeacher />, { store });
    expect(getAdminDetails).toHaveBeenCalled();
  });
 
  test("updates input fields on change", () => {
    renderWithRedux(<EditTeacher />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText(/confirm PW/i), { target: { value: 'newpassword123' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('newpassword123');
    expect(screen.getByLabelText(/confirm PW/i)).toHaveValue('newpassword123');
  });

  test("handles form submission with matching passwords", async () => {
    axios.post.mockResolvedValue({ data: { success: true, message: 'Profile edited successfully!' } });

    renderWithRedux(<EditTeacher />, { store });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText(/confirm PW/i), { target: { value: 'newpassword123' } });

    fireEvent.click(screen.getByText('Edit Teacher'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${apis.BASE}${apis.EDIT_USER}`,
        { _id: '', username: 'Jane Doe', email: 'jane@example.com', password: 'newpassword123' },
        { headers: { Authorization: `Bearer some-token` }}
      );
      expect(Alert).toHaveBeenCalledWith('info', 'Success', 'Profile edited successfully!');
    });
  });

  test("handles form submission with non-matching passwords", async () => {
    renderWithRedux(<EditTeacher />, { store });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText(/confirm PW/i), { target: { value: 'wrongpassword123' } });

    fireEvent.click(screen.getByText('Edit Teacher'));

    await waitFor(() => {
      expect(Alert).toHaveBeenCalledWith('error', 'Invalid Input a', 'Confirm Password does not match');
    });
  });

});