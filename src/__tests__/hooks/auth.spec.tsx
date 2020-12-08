import { act, renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { useAuth, AuthProvider } from '../../hooks/auth';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should ble able to sign in', async() => {

    const apiResponse = {
      user: {
        id: 'user-123',
        name: 'John doe',
        email: 'johndoe@example.com.br',
      },
      token: 'token-123'
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider //O wrapper é o component que vai por volta do useAuth, que vai fornecer as informações, user, signin, signout ...
    });

    result.current.signIn({
      email: 'johndoe@example.com.br',
      password: '123456'
    })

    //Vou aguardar que alguma coise mude no meu hook, como eu atualizado o estado e é assincrono, eu uso esse método wait
    //Sendo assim ele aguarda o signIn mudar e executa o expect abaixo
    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user)
    );
    expect(result.current.user.email).toEqual('johndoe@example.com.br');
  })

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch(key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-123',
            name: 'John doe',
            email: 'johndoe@example.com.br',
          });
          default:
            return null;
      }
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user.email).toEqual('johndoe@example.com.br')
  })

  it('should be able to sign out', async() => {

    //Storage prototype é localStorae para mock
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch(key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-123',
            name: 'John doe',
            email: 'johndoe@example.com.br',
          });
          default:
            return null;
      }
    })

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });


    act(() => {
      result.current.signOut();
    })

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  })

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'avatar-url',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
})
