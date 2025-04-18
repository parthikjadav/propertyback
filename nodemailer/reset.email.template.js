const resetPasswordTemplate = (link) => {
    return `
     <!DOCTYPE html>
     <html>
       <head>
         <meta charset="UTF-8" />
         <title>Reset Your Password</title>
       </head>
       <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
         <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
           <tr>
             <td align="center">
               <h2 style="color: #333;">Reset Your Password</h2>
               <p style="color: #555;">Click the button below to reset your password.</p>
               <a href='${link}' style="display: inline-block; padding: 12px 24px; margin-top: 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
                 Reset Password
               </a>
             </td>
           </tr>
         </table>
       </body>
     </html>
     `
}

module.exports = resetPasswordTemplate