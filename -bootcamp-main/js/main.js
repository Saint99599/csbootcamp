const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
//const loginErrorMsg = document.getElementById("login-error-msg");


const validLogin = isLoggedIn()
if(validLogin) window.open="./betting.html";

// When the login button is clicked, the following code is executed
loginButton.addEventListener("click", (e) => {
    // Prevent the default submission of the form
    e.preventDefault();
    // Get the values input by the user in the form fields
    const username = loginForm.username.value;
    const password = loginForm.password.value;

	basiclogin(username, password);

})

async function basiclogin (username, password) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify({
		"username": username,
		"password": password
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};


	const response = await fetch("http://localhost:4440/auth/signin", requestOptions)
	const token = await response.json()

	//console.log(token.value);

	localStorage.setItem('token', token.value)

	autoRedirect();
}

async function isLoggedIn () {
	const token = localStorage.getItem('token')
	//console.log(token)
	if (token) return true
	else return false
}

async function autoRedirect () {
	const validLogin = await isLoggedIn()
	//console.log(validLogin)
	if (!validLogin) //console.log('Not pass');
		window.location = '/';
	if (validLogin) //console.log('Pass');
		window.location.href="./betting.html";
}