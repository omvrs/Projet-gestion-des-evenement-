document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
 
    if (username === 'admin' && password === 'can2025') {
        alert('Connexion réussie ! Redirection...');
       
        window.location.href = "index.html";
    } else {
        alert('Nom d\'utilisateur ou mot de passe incorrect.');
    }
});

//  masquer/afficher mot de passe 
const passwordInput = document.getElementById('password');
const toggleBtn = document.createElement('span');
toggleBtn.textContent = '👁️';
toggleBtn.style.position = 'absolute';
toggleBtn.style.right = '15px';
toggleBtn.style.top = '50%';
toggleBtn.style.transform = 'translateY(-50%)';
toggleBtn.style.cursor = 'pointer';
toggleBtn.style.fontSize = '1.2rem';

const passwordGroup = passwordInput.parentElement;
passwordGroup.style.position = 'relative';
passwordGroup.appendChild(toggleBtn);

toggleBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
});