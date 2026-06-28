export type TOrder = 'orderO' | 'orderS' | 'orderN';
export type TPanel =
  | 'OrderMessagePanel'
  | 'OrderListPanel'
  | 'OrderTrainPickerPanel'
  | 'OrderHelperPanel';

export interface LocalStorageOrderLegacy {
  id: string;
  orderType: TOrder;
  orderBody: any;
  orderFooter: any;
  createdAt?: number;
  updatedAt?: number;
  orderVersion?: string;
}

export interface IStorageOrderData {
  id: string;
  orderVersion: string;
  createdAt?: number;
  updatedAt?: number;
  orderData: IOrderData;
}

export interface IOrderData {
  header: IOrderHeader;
  instructions: IOrderInstruction[];
  footer: IOrderFooter;
}

export interface IOrderHeader {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface IOrderFooter {
  V: string;
  W: string;
  Y: string;
  Z: string;
}

export interface IOrderFieldItem {
  active: false;
  values: Record<string, string>;
  optionalFieldNames: string[];
}

export interface IOrderInstruction {
  key: string;
  name: string;
  active: boolean;
  inputFields: Record<string, string>;
  optionalFieldNames: string[];
  textDirectives: string[];

  selectFields?: Record<string, Record<string, string[]>>;
  listFields?: IOrderFieldItem[];
}
