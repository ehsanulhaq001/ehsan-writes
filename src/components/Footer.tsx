import React from "react";

// Type declarations for build-time constants
declare const __GIT_COMMIT_HASH__: string;
declare const __GIT_COMMIT_HASH_SHORT__: string;
declare const __BUILD_DATE__: string;

const Footer: React.FC = () => {
  const commitHash = __GIT_COMMIT_HASH__;
  const commitHashShort = __GIT_COMMIT_HASH_SHORT__;
  const buildDate = __BUILD_DATE__;

  return (
    <footer className="footer">
      <p>
        Built with minimal React + TypeScript • No frameworks, no bloat • Just
        content
      </p>
      <div className="version-info">
        <span
          title={`Full commit: ${commitHash}\nBuilt: ${new Date(
            buildDate
          ).toLocaleString()}`}
        >
          v{commitHashShort}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
