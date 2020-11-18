import { ValidationError } from 'yup';

  // Os erros precisam ser dinamicos, ou seja, nao posso setar só name, email, password pq as vezes vai ter erros com mais tipos passo o key:string ... pq dai
  // Aceito qualquer erro e digo que vai ser uma
  // Esse key pode ser qualquer nome
interface Errors {

  [key: string]: string;
}


export default function getValidationErrors(err: ValidationError): Errors {


  const validationErrors: Errors = {};

  err.inner.forEach((error) => {

    validationErrors[error.path] = error.message;;
  })
  return validationErrors;
}
