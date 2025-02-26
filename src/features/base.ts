import { LitElement } from "lit";
import {
  LovelaceCardFeature,
  LovelaceCardFeatureConfig,
} from "../types/ha/feature";
import { property } from "lit/decorators";
import { HomeAssistant } from "../types/ha/lovelace";
import { MaybeMptHassEntity } from "../types/ha/entity";

export abstract class MptLovelaceCardFeature<
    TStateObj extends MaybeMptHassEntity = MaybeMptHassEntity,
  >
  extends LitElement
  implements LovelaceCardFeature
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public stateObj?: TStateObj;

  abstract setConfig(_config: LovelaceCardFeatureConfig): void;

  protected get _isInMptCard() {
    return this.stateObj?.__mpt__internal__ !== undefined;
  }

  // TODO add method to get size
}
