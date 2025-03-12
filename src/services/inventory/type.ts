export interface PayloadInterfaceGetAction {
    client_id?: number;
    id?: string | number;
    start_date?: string | number | null;
    end_date?: string | number | null;
    location_id?: number[];
    status_id?: any[];
    page?: number;
    size?: number;
    search?: any;
  }
  

  interface ReceivedItem {
    inbound_detail_id: number;
    good_quantity: number;
    damage_quantity: number;
  }
  
  export interface PayloadInboundDataProps {
    inbound_id: number;
    received: ReceivedItem[];
  }

  export interface PayloadInterfaceGetActionAdjustment {
    client_id?: number;
    start_date?: string | number | null;
    end_date?: string | number | null;
    location_id?: number[];
    approved_by: number[],
    created_by: number[],
    status_id?: any[];
    page?: number;
    size?: number;
    search?: any;
  }