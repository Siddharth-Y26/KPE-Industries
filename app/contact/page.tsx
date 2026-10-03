import { Contact, Enquiry } from "@/components/Contact";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Krishna Power & Engineers in Gomti Nagar, Lucknow. Send a project enquiry, call, or email our team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader label="Contact" title="Contact us">
        <p>Send an enquiry, call us, or write to us. We will get in touch with you.</p>
      </PageHeader>
      <Enquiry />
      <Contact />
    </>
  );
}
