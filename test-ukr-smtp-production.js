const nodemailer = require('nodemailer');

// Test configurations for UKR.NET
const configs = [
  {
    name: "Port 465 with SSL (Primary)",
    config: {
      host: 'smtp.ukr.net',
      port: 465,
      secure: true,
      auth: {
        user: 'your-email@ukr.net', // Replace with actual email
        pass: 'your-app-password'    // Replace with app-specific password
      }
    }
  },
  {
    name: "Port 2525 with TLS (Alternative)",
    config: {
      host: 'smtp.ukr.net',
      port: 2525,
      secure: false,
      auth: {
        user: 'your-email@ukr.net', // Replace with actual email
        pass: 'your-app-password'    // Replace with app-specific password
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      }
    }
  }
];

async function testConfig(config) {
  console.log(`\n🧪 Testing ${config.name}...`);
  
  try {
    const transporter = nodemailer.createTransport(config.config);
    
    // Test connection
    console.log("  Testing connection...");
    await transporter.verify();
    console.log("  ✅ Connection successful!");
    
    // Test sending email
    console.log("  Testing email sending...");
    const info = await transporter.sendMail({
      from: config.config.auth.user,
      to: 'test@example.com',
      subject: 'Test Email from UKR.NET',
      text: 'This is a test email from UKR.NET SMTP server.',
      html: '<p>This is a test email from UKR.NET SMTP server.</p>'
    });
    
    console.log(`  ✅ Email sent successfully!`);
    console.log(`  📧 Message ID: ${info.messageId}`);
    return true;
    
  } catch (error) {
    console.log(`  ❌ Failed: ${error.message}`);
    console.log(`  Code: ${error.code}`);
    console.log(`  Command: ${error.command}`);
    return false;
  }
}

async function runTests() {
  console.log("🚀 Testing UKR.NET SMTP configurations...");
  console.log("⚠️  Make sure to update email and password in the script!");
  
  for (const config of configs) {
    const success = await testConfig(config);
    if (success) {
      console.log(`\n🎉 ${config.name} WORKS! Use this configuration.`);
      break;
    }
  }
}

runTests().catch(console.error);
