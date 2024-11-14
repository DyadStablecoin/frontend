export interface NoteNumberDataColumnModel {
  text: string;
  value: string | React.ReactNode;
  isComponent: boolean;
}
export interface NoteExtensionsModel {
  label: string;
  description: string;
  address: string;
  enabled: boolean;
  icon: string;
}

export interface VaultCardDataModel {
  currency: string;
  value: string;
}
