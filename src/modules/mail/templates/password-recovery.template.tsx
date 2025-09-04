import {
  Body,
  Head,
  Preview,
  Tailwind,
  Section,
  Text,
  Link,
  Heading,
} from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react";

interface PasswordRecoveryTemplateProps {
  domain: string;
  token: string;
}

export function PasswordRecoveryTemplate({
  domain,
  token,
}: PasswordRecoveryTemplateProps) {
  const resetLink = `${domain}/reset-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Password Reset Request</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-black font-bold">
              Reset your password
            </Heading>
            <Text className="text-base text-black">
              Click the button below to reset your password
            </Text>
            <Link
              href={resetLink}
              className="inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2"
            >
              Reset Password
            </Link>
          </Section>

          <Section className="text-center mt-8">
            <Text className="text-gray-600">
              If you didn't request this, please ignore this email.
            </Text>
            <Text className="text-gray-600">
              Support:
              <Link
                href="mailto:19mip92@gmail.com"
                className="text-[#18b9ae] underline"
              >
                19mip92@gmail.com
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
