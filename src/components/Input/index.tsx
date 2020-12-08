import React, { InputHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { Container, Error } from './styles';
import { useField } from '@unform/core';

//Extendo as propriedades que já existe no input tradicional
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}
const Input: React.FC<InputProps> = ({
    name,
    containerStyle = {},
    icon: Icon,
    ...rest
  }) => {
  const inputRef = useRef<HTMLInputElement>(null);


  const [IsFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  //Com useRef consigo acessar diretamente o input .. como se fosse o key do map .. é obrigatorio usar ele
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value', //Qnd quiser acessar o valor do input, só procurar na propriedade value (do input)
    })
  }, [fieldName, registerField])


  const handleInputFocus = useCallback(() => { //Essa funcao vai ser criada uma unica vez toda vez que esse componente renderizar
      setIsFocused(true);
  },[]);

  //Sempre que tiver uma função dentro de um componente usar o useCallback
  const handleInputBlur = useCallback(() => {
    setIsFocused(false)

    // if(inputRef.current?.value) {
    //   setIsFilled(true);
    // } else {
    //   setIsFilled(false);
    // }
    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    // !!error => Se tem um erro fica true, se não fica false
    <Container
      style={containerStyle}
      isErrored={!!error}isFilled={isFilled}
      isFocused={IsFocused}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input defaultValue={defaultValue}
             ref={inputRef}
             onBlur={handleInputBlur}
             onFocus={handleInputFocus}
             {...rest}
      />
        {error && (
          <Error title={error}>
            <FiAlertCircle color="#c53030" size={20} />
          </Error>
        )}
    </Container>
  )
}

export default Input
