import React from "react";
import { render, screen, fireEvent,waitFor  } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Navigate } from "react-router-dom";
import AddSubject from "./AddSubject";
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

describe("AddSubject Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    Auth.retriveToken.mockReturnValue('some-token');
  });

  test("renders AddSubject component correctly", () => {
    renderWithRedux(<AddSubject />);
    expect(screen.getByText('Add Subjects')).toBeInTheDocument();
  });
 

  test("dispatches getAdminDetails if user is not logged in", () => {
    renderWithRedux(<AddSubject />, { store });
    expect(getAdminDetails).toHaveBeenCalled();
  });

  test("updates name on change", () => {
    renderWithRedux(<AddSubject />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Math' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('Math');
  });

  test("dispatches getTeacherDetails and getDashboardCount on back link click", () => {
    renderWithRedux(<AddSubject />, { store });

    fireEvent.click(screen.getByText('Back'));

    expect(getTeacherDetails).toHaveBeenCalled();
    expect(getDashboardCount).toHaveBeenCalled();
  });

  test("handles form submission", async () => {
    axios.post.mockResolvedValue({ data: { success: true, message: 'Subject created successfully!' } });

    renderWithRedux(<AddSubject />, { store });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'French' } });
    fireEvent.click(screen.getByText('Add Subject'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${apis.BASE}${apis.ADD_SUBJECT}`,
        { name: 'French' },
        { headers: { Authorization: `Bearer some-token` } }
      );

      expect(Alert).toHaveBeenCalledWith('info', 'Success', 'Subject created successfully!');
    });
});
});