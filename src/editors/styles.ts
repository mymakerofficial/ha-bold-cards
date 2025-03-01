import { css } from "lit";

export const editorBaseStyles = css`
  ha-expansion-panel {
    display: block;
    --expansion-panel-content-padding: 0;
    border-radius: 6px;
    --ha-card-border-radius: 6px;
  }

  ha-expansion-panel > * {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }

  ha-expansion-panel .content {
    padding: 12px;
  }
`;
