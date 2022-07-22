export interface LocalStorageOrder {
  id: string;
  orderType: 'orderO' | 'orderS' | 'orderN';
  orderBody: any;
  orderFooter: any;
  createdAt?: number;
  updatedAt?: number;
}
