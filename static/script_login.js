       
/* ------------------------- JS for Sign In page----------------------------------------------------------- */

document.getElementById("loginForm").addEventListener("submit", function(event) { // sign in form on click
    event.preventDefault(); // prevent form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "test@example.com" && password === "123456") {
        alert("Login successful!");
        window.location.href = "/taskit"; // redirect after login
    } else {
        alert("Invalid email or password!");
    }
});

