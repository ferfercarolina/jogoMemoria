document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    const registerMessage = document.getElementById('register-message');
    
    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.username === newUsername);

    if (userExists) {
        registerMessage.textContent = 'Nome de usuário já existe. Tente outro.';
    } else {
        users.push({ username: newUsername, password: newPassword });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'login.html';  // Redireciona para a página de login
    }
});
