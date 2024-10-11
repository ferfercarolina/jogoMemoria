document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');
    
    let users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        localStorage.setItem('loggedInUser', username);
        alert('Login bem-sucedido! Bem-vindo, ' + username);
        window.location.href = 'menu.html';  // Redireciona para o menu do jogo da memória
    } else {
        loginMessage.textContent = 'Nome de usuário ou senha incorretos.';
    }
});
