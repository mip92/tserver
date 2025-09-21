import {
  Body,
  Head,
  Preview,
  Tailwind,
  Section,
  Text,
  Heading,
} from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react";

interface VerificationCodeTemplateProps {
  code: string;
}

export function VerificationCodeTemplate({
  code,
}: VerificationCodeTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-black font-bold mb-4">
              Verification Code
            </Heading>
            <Text className="text-base text-black mb-6">
              Your verification code is:
            </Text>
            <div className="bg-gray-100 p-4 rounded-lg inline-block">
              <Text className="text-4xl font-bold text-[#18B9AE] tracking-widest">
                {code}
              </Text>
            </div>
            <Text className="text-sm text-gray-600 mt-4">
              This code will expire in 20 minutes.
            </Text>
            <Text className="text-sm text-gray-600">
              If you didn't request this code, please ignore this email.
            </Text>
          </Section>

          <Section className="text-center mt-8">
            <Text className="text-gray-600">
              Support
              <a
                href="mailto:19mip92@gmail.com"
                className="text-[#18b9ae] underline ml-1"
              >
                19mip92@gmail.com
              </a>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
