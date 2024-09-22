import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";

const pageStyles = {
  color: "#232129",
  padding: "96px",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};

const paragraphStyles = {
  marginBottom: 48,
};

const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
};

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>Page not found</h1>
      <p style={paragraphStyles}>
        Sorry 😔, we couldn’t find what you were looking for.
        <br />
        {process.env.NODE_ENV === "development" ? (
          <>
            <br />
            Try creating a page in <code style={codeStyles}>src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/">Go home</Link>.
      </p>
    </main>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => (
  <>
    <title>404 Not Found</title>
    <meta name="description" content="The page you are looking for does not exist." />
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="https://www.yourwebsite.com/404" /> {/* 替換為實際網址 */}
    <meta property="og:title" content="404 Not Found" />
    <meta property="og:description" content="The page you are looking for does not exist." />
    <meta property="og:url" content="https://www.yourwebsite.com/404" /> {/* 替換為實際網址 */}
  </>
);