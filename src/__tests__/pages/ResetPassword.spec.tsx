import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, wait } from '@testing-library/react';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const mockedHistory = jest.fn();
const mockedLocation = jest.fn(() => '?token=');
const mockedAddToast = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistory,
    }),
    useLocation: () => ({
      search: {
        replace: mockedLocation,
      }
    })
  }
})

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    })
  }
})

describe('ResetPassword Page', () => {

  beforeEach(() => {
    mockedHistory.mockClear();
    mockedAddToast.mockClear();
  })

  it('should be able to reset password', async () => {

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmação da nova senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, { target: { value: '123456' } })

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistory).toHaveBeenCalledWith('/dashboard');
    })
  })

  it('should be able to not reset password because they do not match', async () => {

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmação da nova senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, { target: { value: 'invalid-password' } })

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistory).not.toHaveBeenCalled();
    })
  })

  it('should be able generate an error because the token was not provided by the url', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText('Confirmação da nova senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } })
    fireEvent.change(passwordConfirmationField, { target: { value: '123456' } })

    fireEvent.click(buttonElement);

    await wait(() => {;
      expect(mockedHistory).not.toHaveBeenCalled();
    })
  })
})
