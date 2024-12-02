import React from "react";
import ReactMarkdown from "react-markdown";
import { Typography } from "@mui/material";

const MarkdownRenderer = ({ markdownText }) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.5 }}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <Typography variant="h4" style={{ fontFamily: "Roboto, sans-serif" }} {...props} />
          ),
          p: ({ node, ...props }) => (
            <Typography variant="body1" style={{ fontSize: "16px" }} {...props} />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code style={{ fontFamily: "Courier New, monospace", backgroundColor: "#f4f4f4" }} {...props} />
            ) : (
              <pre style={{ fontFamily: "Courier New, monospace", backgroundColor: "#f4f4f4" }}>
                <code {...props} />
              </pre>
            ),
        }}
      >
        {markdownText}
      </ReactMarkdown>  
    </div>
  );
};

export default MarkdownRenderer;
