import mailgen from "mailgen";

/* ------------------------------------------------------------ 
========= = = =    EMAIL GENERATE  CONTENT   = = = ===============
----------------------------------------------------------------
*/
  
const emailVerificationMailgenContent = (username , emailVerificationUrl)=>{

    return {
      body: {
        name: username,
        intro: 'Welcome to projectCampy ! We\'re very excited to have you on board.',
        action: {
            instructions: "To verify your email please click on the following below button ",
            button: {
                color: '#22BC66', 
                text: 'Confirm your account',
                link:  emailVerificationUrl ,
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
    }
}



 
const resetPasswordMailgenContent = (username , resetPasswordUrl)=>{

    return {
      body: {
        name: username,
        intro: 'Welcome to projectCampy ! We\'re very excited to have you on board.',
        action: {
            instructions: "To reset your password please click on the following below button ",
            button: {
                color: '#ee0808', 
                text: 'Reset your password',
                link:   resetPasswordUrl ,
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
    }
}


export {
      emailVerificationMailgenContent ,
      resetPasswordMailgenContent ,
}