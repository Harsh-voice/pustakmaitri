import { LegalPageContent, legalMetadata } from "@/components/legal/legal-page";

type Props = { params: Promise<{ locale: string }> };
export const generateMetadata = ({ params }: Props) => legalMetadata("privacy", params);
export default function Page({ params }: Props) {
  return <LegalPageContent slug="privacy" params={params} />;
}
