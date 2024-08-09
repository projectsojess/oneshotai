import DOMPurify from 'dompurify';
import { marked } from 'marked';

export const MessageRenderer = ({ content }: { content: string }) => {
    // Convert Markdown to HTML
    const rawHtml = marked(content);
    
    // Sanitize the HTML
    const sanitizedContent = DOMPurify.sanitize(rawHtml);
    
    return (
      <div 
        className="message-content prose dark:prose-invert max-w-none mt-4"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
      />
    );
  };