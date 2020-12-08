import React from 'react';
import { fireEvent, render, wait } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();


jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children, //React Node é qualquer conteudo que o componente react pode receber ... muito usuado em childrens
  };
});

jest.mock('../../hooks/auth', () => {
//Preciso mockar, para simular apenas que vai ser redirecionado, não preciso validar token etc,
//Isso fica responsável pelos testes dos hooks
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    })
  }
})

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  }
})

describe('SignIn Page', () => {

  beforeEach(() => { //Como os dois testes irão utilizar a função mockada, o beforeEach executa antes de cada um dos testes limpa essa função para zerar ela.
    mockedHistoryPush.mockClear();
  })

  it('should be able to sign in', async() => {

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    })
  });

  it('should not be able to sign in with invalid credentials', async() => {

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    })
  });

  it('should display an error if login fails', async() => {

    //Mock implementation para sobescrever a função do mock signIn lá de cima
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    })

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error'
        })
      );
    })
  });
});
