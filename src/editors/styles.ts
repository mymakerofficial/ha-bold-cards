import { css } from "lit";

export const editorBaseStyles = css`
  .flex-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }

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

  ha-select-box {
    --ha-card-border-radius: 6px;
  }
`;
