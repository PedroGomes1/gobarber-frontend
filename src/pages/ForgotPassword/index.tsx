import React, { useRef, useCallback, useState } from 'react';
import { FiMail, FiArrowDownLeft } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import {Form} from '@unform/web';
import { FormHandles } from '@unform/core';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import { Container, AnimationContainer, Content, Background } from './styles';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {

  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    setLoading(true);

    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório').email('Digite um e-mail válido'),
      })
      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('/password/forgot', {
        email: data.email,
      })

      addToast({
        type: 'success',
        title: 'E-mail de recuperação enviado',
        description: 'Enviamos um e-mail para recuperação de senha, cheque sua caixa de entrada.'
      })

      // history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors)

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na recuperação de senha',
        description: 'Ocorreu um erro ao tentar recuperar sua senha, tente novamente!'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast])
  return (

  <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">Recuperar senha</Button>
          </Form>

          <Link to="/">
            <FiArrowDownLeft/>
            Voltar para logon
          </Link>
        </AnimationContainer>

      </Content>

      <Background />
  </Container>
  )
}


export default ForgotPassword;
