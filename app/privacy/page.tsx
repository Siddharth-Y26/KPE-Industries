import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { cityLine, siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How the Krishna Power & Engineers website handles the information you send through it.",
  path: "/privacy",
});

// DRAFT for the client to review. It describes what this website actually does with
// information; keep it in step with the enquiry endpoint in worker/ if that changes.
export default function PrivacyPage() {
  const { contact } = siteConfig;

  return (
    <>
      <PageHeader label="Privacy Policy" title="Privacy Policy">
        <p>How this website handles the information you send through it.</p>
      </PageHeader>
      <Prose>
        <h2>Who We Are</h2>
        <p>
          This website is operated by {siteConfig.name}, {contact.registeredOffice.line1},{" "}
          {contact.registeredOffice.line2}, {cityLine(contact.registeredOffice)}.
        </p>

        <h2>Information You Give Us</h2>
        <p>When you send an enquiry through the form on this website, we receive the details you enter:</p>
        <ul>
          <li>your name and company name</li>
          <li>your email address and phone number</li>
          <li>the service you are enquiring about and your message</li>
          <li>the project location, estimated capacity and preferred contact method, if you choose to give them</li>
        </ul>

        <h2>How We Use It</h2>
        <p>
          We use these details only to respond to your enquiry and to discuss the work you have asked about. We do
          not sell your information, and we do not use it for advertising.
        </p>

        <h2>How It Reaches Us</h2>
        <p>
          Your enquiry is delivered to our business email inbox through an email delivery service. This website does
          not keep a copy of your enquiry in a database.
        </p>

        <h2>Security and Abuse Prevention</h2>
        <p>
          This website is served through a content delivery and security network. To protect the website and the
          enquiry form from automated abuse, that service processes technical information about each request, such
          as the IP address, and may ask your browser to complete an automated check before an enquiry is sent.
        </p>

        <h2>Cookies</h2>
        <p>
          We do not use advertising cookies. The security service described above may set cookies that are strictly
          necessary to protect the website.
        </p>

        <h2>WhatsApp, Phone and Email</h2>
        <p>
          If you contact us by WhatsApp, phone or email instead of the form, your message is handled by that service
          under its own terms and privacy policy.
        </p>

        <h2>Your Choices</h2>
        <p>
          To ask what information we hold about your enquiry, or to ask us to correct or delete it, write to us at{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </Prose>
    </>
  );
}
