ingresarSistema = () => {
    document.querySelector('#loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        console.log(username, password);

         // Validación simple antes de enviar los datos a la API
      if (username === '' || password === '') {
        document.querySelector('.login-result').innerHTML = '<div class="alert alert-danger position-fixed fixed-bottom ">Por favor, completa todos los campos.</div>';
        return;
      }

       // Hacemos la solicitud POST con fetch
  fetch('https://fakestoreapi.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Aseguramos que el cuerpo sea JSON
    },
    body: JSON.stringify({
      username: username,  // el nombre de usuario
      password: password   // la contraseña
    })
  })
  .then(response => {
    // Comprobamos si la respuesta tiene formato JSON
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json(); // Procesamos como JSON si es válido
    } else {
      return response.text(); // Si no es JSON, lo procesamos como texto
    }
  })
  .then(data => {
    // Si recibimos un objeto JSON con el token
    if (data.token) {
      document.querySelector('.login-result').innerHTML = '<div class="alert alert-success">¡Login exitoso! </div>';
      window.location.href = 'pages/productos.html';
      localStorage.setItem('authToken', data.token); // Guardamos el token si es necesario
    } else {
      // Mostramos el mensaje si no hay token
      document.querySelector('.login-result').innerHTML = '<div class="alert alert-danger">Error en el login. ' + (data ? data : 'Revisa tus credenciales.') + '</div>';
    }
  })
  .catch(error => {
    // Si ocurre un error, lo mostramos
    document.querySelector('.login-result').innerHTML = '<div class="alert alert-danger">Error: ' + error.message + '</div>';
    console.error('Error:', error);
  });
    })
}

cerrarSesion =  () => {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}

mostrarProductos = () => {
    fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(dataProducts=> {
                const divPro = document.querySelector('.productos');

                dataProducts.forEach(product => {
                    const divC = document.createElement('div');
                    divC.classList.add('col-4', 'mb-4', 'p-3');
                    divC.innerHTML = `
                        <div class="card h-100 ">
                            <img src="${product.image}" class="card-img-top w-50 h-auto pb-3 pt-3 align-self-center" alt="...">
                            <div class="card-body align-self-center">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">${product.description}</p>
                                
                            </div>
                            <div class="card-footer text-center d-flex justify-content-between">
                            <p class="card-text">$${product.price}</p>
                                <a href="#" class="btn btn-primary col-6" onclick="agregarAlCarrito(${product.id})">Add</a>
                            </div>
                        </div>
                    `;
                divPro.appendChild(divC);
                    
                })
            })
            .catch(err=>console.log(err))
}

mostrarProductos();