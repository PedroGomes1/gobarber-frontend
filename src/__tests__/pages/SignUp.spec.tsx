import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import SignUp from '../../pages/SignUp';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
})

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  }
})

describe('SignUp Page', () => {

  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  })

  it('should be able to sign up', async () => {

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');

    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John' } })
    fireEvent.change(emailField, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement);

    const apiResponse = {
      name: 'John',
      email: 'john@example.com',
      password: '123456'
    }

    apiMock.onPost('users').replyOnce(200, apiResponse);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success'
        })
      )
    })
  });

  it('should be able to invalid fields values', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');

    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John' } })
    fireEvent.change(emailField, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    })
  });

  it('should be display an error', async () => {
    apiMock.onPost('users').replyOnce(400);

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');

    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John' } })
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error'
        })
      )
    })
  });
})
