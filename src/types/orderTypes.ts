export interface LocalStorageOrder {
  orderType: 'orderO' | 'orderS' | 'orderN';
  orderBody: any;
  orderFooter: any;
  createdAt: number;
}
