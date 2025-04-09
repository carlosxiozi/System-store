import Spinner from 'react-bootstrap/Spinner';

function BasicExample() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner style={{height:"40px", width:"40px"}} animation="border" role="status">
        
      </Spinner>
      <h3 className="ms-3">Cargando...</h3>
    </div>
  );
}

export default BasicExample;