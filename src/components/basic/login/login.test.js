import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Login from "./Login";
import { loginUser } from '../../../redux/actions/loginAction';

jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => null),
}));

// Mock the loginUser action to be a thunk
jest.mock('../../../redux/actions/loginAction', () => ({
  loginUser: jest.fn((credentials) => {
    return (dispatch) => {
      dispatch({ type: 'LOGIN_USER', payload: credentials });
    };
  }),
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

describe("Login Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test("renders Login component correctly", () => {
    renderWithRedux(<Login />);
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  test("updates username and password on change", () => {
    renderWithRedux(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testPassword' } });

    expect(screen.getByLabelText(/username/i)).toHaveValue('testUser');
    expect(screen.getByLabelText(/password/i)).toHaveValue('testPassword');
  });

  test("dispatches loginUser on form submit", () => {
    renderWithRedux(<Login />, { store });

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testPassword' } });

    fireEvent.click(screen.getByText('LOGIN'));

    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'LOGIN_USER', payload: { username: 'testUser', password: 'testPassword' } });
  });

/*   test("navigates to /home if user is logged in", () => {
    store = mockStore({
      user: {
        isLoggedIn: true,
      },
    });

    renderWithRedux(<Login />, { store });

    expect(Navigate).toHaveBeenCalledWith({ to: '/home' }, {});
  }); */
});





/* import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from "./Login";
import { loginUser } from '../../../redux/actions/loginAction';

jest.mock("react-router-dom", () => ({
  Navigate: jest.fn(() => null),
}));

jest.mock('../../../redux/actions/loginAction', () => ({
  loginUser: jest.fn(),
}));


const mockStore = configureStore([]);
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

describe("Login Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

   test("renders Login component correctly", () => {
    renderWithRedux(<Login />);
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

   test("updates username and password on change", () => {
    renderWithRedux(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testPassword' } });

    expect(screen.getByLabelText(/username/i)).toHaveValue('testUser');
    expect(screen.getByLabelText(/password/i)).toHaveValue('testPassword');
  });

  test("dispatches loginUser on form submit", () => {
    renderWithRedux(<Login />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testPassword' } });

    fireEvent.click(screen.getByText('LOGIN'));

    expect(loginUser).toHaveBeenCalledWith({ username: 'testUser', password: 'testPassword' });
  });

   test("navigates to /home if user is logged in", () => {
    store = mockStore({
      user: {
        isLoggedIn: true,
      },
    });

    renderWithRedux(<Login />, { store });

    expect(Navigate).toHaveBeenCalledWith({ to: '/home' }, {});
  });
}); */