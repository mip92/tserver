import { Body, Head, Preview, Tailwind, Section, Text, Link, Heading } from "@react-email/components"
import { Html } from "@react-email/html";
import * as React from "react";

interface VerificationTemplateProps{
    domain: string,
    token: string
}
export function VerificationTemplate({domain, token}: VerificationTemplateProps){
    const verificationLink = `${domain}/account/verify?token=${token}`
    return (
        <Html>
            <Head/>
            <Preview>Account Verification</Preview>
            <Tailwind>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            Verify your email
                        </Heading>
                        <Text className="text-base text-black">
                            Thank you
                        </Text>
                        <Link href={verificationLink} className="inline-flex
                        justify-center items-center rounded-full text-sm
                        font-medium text-white bg-[#18B9AE] px-5 py-2">
                            Verify Email
                        </Link>
                    </Section>

                    <Section className="text-center mt-8">
                        <Text className="text-gray-600">
                            Support
                            <Link
                                href='mailto:19mip92@gmail.com'
                                className="text-[#18b9ae] underline"
                            >
                                19mip92@gmail.com
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}