import Mailgen from "mailgen";
import nodemailer from "nodemailer"

/* ------------------------------------------------------------ 
========= = = = * *   EMAIL GENERATE  CONTENT  * * = = = ===============
----------------------------------------------------------------
*/
  
const emailVerificationMailgenContent = (username , emailVerificationUrl)=>{
console.log( emailVerificationUrl,username);
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


/* -----------------  Send Email via nodemailer npm library :: Mailtrap   --------------------- */

const sendEmail = async ( option ) =>{
  const mailGenerator =  new Mailgen({
        theme:"default", 
        product: {
            name :"ProjectCampy",
            link : "https://myCompanylink.com"
        }
    })

      const emailTexual= mailGenerator.generatePlaintext(option.mailgenContent);

      const emailHTML = mailGenerator.generate(option.mailgenContent);

       const transporter =nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST ,
        port : process.env.MAILTRAP_SMTP_PORT , 
        auth : {
            user : process.env.MAILTRAP_SMTP_USER ,
            pass : process.env.MAILTRAP_SMTP_PASS ,

        }
      })
const mail = {  
    from : "YourCompany@example.com" ,
    to: option.email ,
    subject : option.subject ,
    text: emailTexual , 
    html :emailHTML ,
}

try {
   await transporter.sendMail(mail) ;
} catch (error) {
   console.error("Email send Falied siliently . Make sure that You have provided your MAILTRAP credentials in the .env file");
   console.error("Error : " , error); 
}

}



export {
      emailVerificationMailgenContent ,
      resetPasswordMailgenContent ,
      sendEmail ,
}