/**
 * sucess message template
 * @returns HTML
 */
function passwordResetedTemplate() {
    return /*html*/ `
        <a href="./index.html"><img src="./assets/img/arrow-back.png" alt="back to login" class="signup-back"></a>
        <div class="headline-container">
            <h1 class="headline">Password reseted</h1>
            <div class="login-headline-border"></div>
        </div>

        <div class="signup-complete-text">
            Your password has been successfully changed.<br> You can log in <a href="./index.html">here</a>.
        </div>`;
}


/**
 * info expired link template
 * @returns HTML
 */
function passwordTimeoutTemplate() {
    return /*html*/ `
        <a href="./forgot-password.html"><img src="./assets/img/arrow-back.png" alt="back to login" class="signup-back"></a>
        <div class="headline-container">
            <h1 class="headline">Password reseted</h1>
            <div class="login-headline-border"></div>
        </div>

        <div class="signup-complete-text">
            Unfortunately, the link has expired. You have a maximum of 24 hours to reset a password after requesting the link.<br> You can request the link again <a href="./forgot-password.html">here</a>.
        </div>`;
}