import { PageHeader } from "@/components/PageHeader";
import { Prose } from "@/components/ui/Prose";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Website Disclaimer",
  description: "Terms on which the information on the Krishna Power & Engineers website is provided.",
  path: "/disclaimer",
});

// DRAFT for the client to review.
export default function DisclaimerPage() {
  return (
    <>
      <PageHeader label="Website Disclaimer" title="Website Disclaimer">
        <p>The terms on which the information on this website is provided.</p>
      </PageHeader>
      <Prose>
        <h2>General Information</h2>
        <p>
          The content of this website is provided by {siteConfig.name} for general information about the company and
          its services. It is not an offer, a quotation or a contract. The scope, price and schedule of any work are
          agreed separately in writing.
        </p>

        <h2>Accuracy</h2>
        <p>
          We take care to keep the information on this website accurate and up to date. Project and client details
          are drawn from our company records and are shown for reference. If you find something that looks wrong,
          please tell us at <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
        </p>

        <h2>Names and Trademarks</h2>
        <p>
          Company names mentioned on this website belong to their respective owners. They are named only to describe
          work carried out, and their mention does not imply endorsement.
        </p>

        <h2>External Links</h2>
        <p>
          This website links to external services such as Google Maps and WhatsApp. We are not responsible for the
          content or the privacy practices of those services.
        </p>
      </Prose>
    </>
  );
}
