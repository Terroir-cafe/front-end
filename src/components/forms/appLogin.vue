<template>
    <div class="signup-container">
    <div class="title-wrapper">
        <h2 class="signup-title">Faça Login</h2>
        <div class="title-line"></div>
    </div>

    <form class="signup-form" action="#" method="POST">
        <input type="email" class="input-field" placeholder="Email" required>
        <input type="password" class="input-field" placeholder="Senha" required>        
        <button type="submit" class="btn-submit">Confirmar</button>
    </form>

    <div class="login-prompt">
        <span>Não possui uma conta?</span>
        <a href="/signup" class="login-link">Cadastrar</a>
    </div>
    </div>
</template>

<style scoped>
    .signup-container {
        padding: 40px 30px;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title-wrapper {
        width: 100%;
        text-align: center;
        margin-bottom: 40px;
    }

    .signup-title {
        color: #000000;
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 10px;
    }

    .title-line {
        width: 100%;
        height: 2px;
        background-color: #000000;
    }

    .signup-form {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .input-field {
        width: 100%;
        padding: 12px 20px;
        margin-bottom: 25px;
        border: 1px solid #e2c29f; 
        border-radius: 25px; 
        font-size: 16px;
        font-weight: 600;
        color: #333;
        outline: none;
        transition: border-color 0.2s ease;
    }

    .input-field:focus {
        border-color: #6d423b; 
    }

    .input-field::placeholder {
        color: #bfa89a; 
        font-weight: 600;
    }

    .btn-submit {
        background-color: #6d423b;
        color: #ffffff;
        border: none;
        border-radius: 25px;
        padding: 12px 40px;
        font-size: 16px;
        font-weight: 700;
        margin-top: 40px; 
        margin-bottom: 40px;
        cursor: pointer;
        width: max-content;
    }

    .btn-submit:active {
        transform: scale(0.98); 
    }

    .login-prompt {
        text-align: center;
        font-size: 14px;
    }

    .login-prompt span {
        color: #000000;
        font-weight: 800;
        display: block;
        margin-bottom: 5px;
    }

    .login-link {
        color: #e2c29f; 
        font-weight: 700;
        text-decoration: none;
    }

    /* Versão Desktop */
    @media (min-width: 768px) {
        .signup-container {
            max-width: 600px;
            padding: 60px 50px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border-radius: 56px;
        }

        .signup-title {
            font-size: 32px;
        }

        .input-field {
            padding: 15px 25px;
            font-size: 18px;
        }

        .btn-submit {
            padding: 15px 50px;
            font-size: 18px;
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .login-prompt {
            font-size: 16px;
        }
    }

    @media (min-width: 1024px) {
        .signup-container {
            max-width: 700px;
            padding: 80px 60px;
        }

        .signup-title {
            font-size: 36px;
        }

        .input-field {
            padding: 18px 30px;
            font-size: 20px;
        }

        .btn-submit {
            padding: 18px 60px;
            font-size: 20px;
        }
    }
</style>