import React from "react";
import Styles from "../styles/section.module.css";

export default function SectionPrompt({ prompt }) {
  if (prompt)
    return (
      <div id={Styles.container}>
        <span className={Styles.directions}>Scenario:</span>
        {prompt}
      </div>
    );
  return <></>;
}
