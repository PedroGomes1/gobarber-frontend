import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles'
//Como seria uma interface vazia, sem nenhum atributo, eu escrevo com o type
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

//Children vai ser o conteudo do botão, e o rest é o resto das propriedadess
const Button: React.FC<ButtonProps> = ({children, loading, ...rest}) =>
(
      <Container type="button"{...rest}>
        {loading? 'Carregando...' : children}
      </Container>
// Como tem o type submit lá no Component que for utilizar, vai sobEscrever esse type="button" daqui, o React controla isso
);

export default Button
