const loggedOutButtons = $('#logged-out-buttons');
const loggedInButtons = $('#logged-in-buttons');

fetch('/logintest')
    .then(response => {
        if (response.status === 401 || response.status === 403) {
            loggedInButtons.hide();
        } else {
            $('#user-page-button').html(sessionStorage.getItem('username'));
            loggedOutButtons.hide();
        }
    });

function login() {
    const usernameInput = $('#username-input');
    const passwordInput = $('#password-input');
    const username = usernameInput.val();
    const password = passwordInput.val();

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(response => {
            handleResponse(response, (response) => {
                response.json()
                    .then(result => {
                        modalAlert(result.message, 'login', 'success');
                        sessionStorage.setItem('username', result.username);
                        $('#user-page-button').text(sessionStorage.getItem('username'));
                        loggedOutButtons.hide();
                        loggedInButtons.show();
                        setTimeout(() => {
                            $('#login-modal').modal('toggle');
                            usernameInput.val('');
                            passwordInput.val('');
                        }, 1500);
                    });
            }, (error) => {
                modalAlert(error, 'login', 'warning');
            });
        });
}

function anonymousLogin() {
    fetch('/auth/login', {
        method: 'POST'
    })
        .then(response => {
            handleResponse(response, (response) => {
                response.json()
                    .then(result => {
                        modalAlert(result.message, 'login', 'success');
                        $('#user-page-button').hide();
                        loggedOutButtons.hide();
                        loggedInButtons.show();
                        setTimeout(() => {
                            $('#login-modal').modal('toggle');
                            $('#username-input').val('');
                            $('#password-input').val('');
                        }, 1500);
                    });
            }, (error) => {
                modalAlert(error, 'login', 'warning');
            });
        });
}

function logout() {
    fetch('/logout')
        .then(response => {
            handleResponse(response, (response) => {
                response.json()
                    .then(result => {
                        sessionStorage.removeItem('username');
                        loggedInButtons.hide();
                        loggedOutButtons.show();
                        $('#user-page-button').show();
                        popUpAlert(result.message, 'info');
                        showPage('');
                    });
            }, (error) => {
                popUpAlert(error, 'warning');
            });
        });
}

function passwordReset() {
    const username = $('#username-password-reset-input').val();

    fetch('/auth/passwordreset/', {
        method: 'POST',
        headers:  {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username
        })
    })
        .then(response => {
            handleResponse(response, (response) => {
                response.json()
                    .then(result => {
                        $('#request-password-reset-modal').modal('hide');
                        popUpAlert(result.message, 'success');
                    });
            }, (error) => {
                modalAlert(error, 'request-password-reset', 'warning');
            });
        })
}

function register() {
    const usernameInput = $('#username-register-input');
    const passwordInput = $('#password-register-input');
    const passwordConfirmInput = $('#password-confirm-register-input');
    const username = usernameInput.val();
    const password = passwordInput.val();
    const passwordConfirm = passwordConfirmInput.val();

    if (password !== passwordConfirm) {
        modalAlert('Passwords do not match.', 'register', 'warning');
    } else if (password.length < 8) {
        modalAlert('Password is too short. Needs to be at least 8 characters.', 'register', 'warning');
    } else {
        fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
            .then(response => {
                handleResponse(response, (response) => {
                    response.json()
                        .then(result => {
                            modalAlert(result.message, 'register', 'success');
                            sessionStorage.setItem('username', result.username);
                            $('#user-page-button').html(sessionStorage.getItem('username'));
                            loggedOutButtons.hide();
                            loggedInButtons.show();
                            setTimeout(() => {
                                $('#register-modal').modal('toggle');
                                usernameInput.val('');
                                passwordInput.val('');
                                passwordConfirmInput.val('');
                            }, 1500);
                        });
                }, (error) => {
                    modalAlert(error, 'register', 'warning');
                });
            });
    }
}