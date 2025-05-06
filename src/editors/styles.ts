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

  .panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border-radius: 6px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--outline-color);
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

  .sub-editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sub-header .title {
    flex: 1;
    font-size: 18px;
  }
`;
