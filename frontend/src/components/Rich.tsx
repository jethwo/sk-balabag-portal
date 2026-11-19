import DOMPurify from "dompurify";

/** Shows rich-text HTML from the CMS. Django already sanitizes it; DOMPurify is a second safety net. */
export default function Rich({ html }: { html: string }) {
  return <div className="rich" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}
