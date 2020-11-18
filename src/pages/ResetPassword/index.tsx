import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import {Form} from '@unform/web';
import { FormHandles } from '@unform/core';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { Container, AnimationContainer, Content, Background } from './styles';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const location = useLocation();

  const { addToast } = useToast();
  const history = useHistory();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatória'),
        password_confirmation: Yup.string().oneOf([
          Yup.ref('password')],
          'Confirmação incorreta'
        ),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      const { password, password_confirmation } = data;
      const token = location.search.replace('?token=', '');

      if(!token) {
          throw new Error();
      }

      await api.post('/password/reset', {
        password,
        password_confirmation,
        token
      })

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors)

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar sua senha, tente novamente'
      });
    }
  }, [addToast, history, location.search])
  return (

  <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input name="password" type="password" icon={FiLock} placeholder="Nova senha" />

            <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação da nova senha" />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>

      </Content>

      <Background />
  </Container>
  )
}


export default ResetPassword;
