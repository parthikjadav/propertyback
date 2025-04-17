const template = (otp) => {
   return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif;">
  <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" valign="middle">
        <table cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center">
              <p style="font-size: 32px; font-weight: bold; margin: 0; color: #333;">Your OTP</p>
              <p style="font-size: 48px; font-weight: bold; letter-spacing: 6px; margin: 20px 0; color: #000;">${otp}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
module.exports = template