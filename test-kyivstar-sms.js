const axios = require("axios");

// Конфигурация Киевстар
const KYIVSTAR_CLIENT_ID = "869f7b6c-f6fc-42a7-bf62-bc2c57dcf1c2";
const KYIVSTAR_CLIENT_SECRET =
  process.env.KYIVSTAR_CLIENT_SECRET || "your_client_secret";
const KYIVSTAR_API_URL = "https://api-gateway.kyivstar.ua";

async function testKyivstarSms() {
  console.log("🔍 Testing Kyivstar SMS API...");
  console.log(`Client ID: ${KYIVSTAR_CLIENT_ID}`);
  console.log(`API URL: ${KYIVSTAR_API_URL}`);

  try {
    // 1. Получаем токен доступа
    console.log("\n1. Getting access token...");
    const tokenResponse = await axios.post(
      `${KYIVSTAR_API_URL}/idp/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: KYIVSTAR_CLIENT_ID,
          password: KYIVSTAR_CLIENT_SECRET,
        },
      }
    );

    console.log("✅ Access token obtained successfully");
    console.log(`Token type: ${tokenResponse.data.token_type}`);
    console.log(`Expires in: ${tokenResponse.data.expires_in} seconds`);

    const accessToken = tokenResponse.data.access_token;

    // 2. Проверяем баланс
    console.log("\n2. Checking SMS balance...");
    try {
      const balanceResponse = await axios.get(
        `${KYIVSTAR_API_URL}/sms/balance`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("✅ Balance retrieved successfully");
      console.log(`Balance: ${balanceResponse.data.balance}`);
    } catch (balanceError) {
      console.log("⚠️  Balance check failed (this might be normal):");
      console.log(balanceError.response?.data || balanceError.message);
    }

    // 3. Тестируем отправку SMS (только если указан номер телефона)
    const testPhone = process.env.TEST_PHONE;
    if (testPhone) {
      console.log(`\n3. Testing SMS send to ${testPhone}...`);
      try {
        // Форматируем номер телефона (убираем +)
        const formattedPhone = testPhone.replace("+", "");

        const smsResponse = await axios.post(
          `${KYIVSTAR_API_URL}/sandbox/rest/v1beta/sms`,
          {
            from: "messagedesk",
            to: formattedPhone,
            text: "Test message from Kyivstar API integration",
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ SMS sent successfully");
        console.log(`Response:`, smsResponse.data);
      } catch (smsError) {
        console.log("❌ SMS send failed:");
        console.log(smsError.response?.data || smsError.message);
      }
    } else {
      console.log("\n3. Skipping SMS send test (no TEST_PHONE provided)");
      console.log(
        "   To test SMS sending, set TEST_PHONE environment variable"
      );
      console.log(
        "   Example: TEST_PHONE=+380501234567 node test-kyivstar-sms.js"
      );
    }

    console.log("\n✅ Kyivstar SMS API test completed successfully!");
  } catch (error) {
    console.log("\n❌ Kyivstar SMS API test failed:");
    console.log("Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log("\n💡 Possible solutions:");
      console.log("1. Check if KYIVSTAR_CLIENT_SECRET is correct");
      console.log("2. Verify that the client credentials are valid");
      console.log("3. Make sure the client has SMS permissions");
    }
  }
}

// Запускаем тест
testKyivstarSms();
