import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

export default function useProviderOrdersApi() {
  const axios = useApi();
  const { response } = responseApi();

  const store = useAuthStore();
  const { token } = storeToRefs(store);

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  const buildFormData = (payload = {}) => {
    const fd = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        fd.append(key, value);
      }
    });
    return fd;
  };

  const parseListResponse = (res) => {
    const root = res?.data?.data || {};
    return {
      list: Array.isArray(root?.data) ? root.data : [],
      pagination: root?.pagination || {
        total_items: 0,
        per_page: 20,
        current_page: 1,
        total_pages: 1,
      },
    };
  };

  const getNormalOrders = async (tab = 'new', page = 1) => {
    const endpointMap = {
      new: 'provider/orders/new',
      current: 'provider/orders/current',
      finished: 'provider/orders/finished',
    };

    const endpoint = endpointMap[tab] || endpointMap.new;
    const res = await axios.get(`${endpoint}?page=${page}`, authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      ...parseListResponse(res),
      raw: res,
    };
  };

  const getRetrievalOrders = async (page = 1, perPage = 20) => {
    const res = await axios.get(`provider/retrieval-orders?paginate=${perPage}&page=${page}`, authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      ...parseListResponse(res),
      raw: res,
    };
  };

  const getNormalOrderDetails = async (id) => {
    const res = await axios.get(`provider/orders/details/${id}`, authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const getRetrievalOrderDetails = async (id) => {
    const res = await axios.get(`provider/retrieval-orders/details/${id}`, authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const getOrderInvoice = async (id) => {
    const res = await axios.get(`provider/orders/invoice/${id}`, authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const sendOrUpdateOffer = async (payload) => {
    const res = await axios.post('provider/orders/send-update-offer', buildFormData(payload), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const calculateOfferVat = async (payload) => {
    const res = await axios.post('provider/orders/calculate-offer-vat', buildFormData(payload), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const getProductsFromBaseProduct = async (baseProductId) => {
    const res = await axios.get(`provider/products/${baseProductId}/get-products`, authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: Array.isArray(res?.data?.data) ? res.data.data : [],
      raw: res,
    };
  };

  const getVariantsFromProduct = async (productId) => {
    const res = await axios.get(`provider/products/${productId}/get-variants`, authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: Array.isArray(res?.data?.data) ? res.data.data : [],
      raw: res,
    };
  };

  const issueInvoice = async (payload) => {
    const res = await axios.post('provider/orders/issue-invoice', buildFormData(payload), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const preparedOrder = async (id, delegateId = null) => {
    const payload = delegateId ? { delegate_id: delegateId } : {};
    const res = await axios.post(`provider/orders/prepared/${id}`, buildFormData(payload), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const deliverToUserDelegate = async (id) => {
    const res = await axios.post(`provider/orders/deliver-to-user-delegate/${id}`, buildFormData({}), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const rejectOrder = async (id) => {
    const res = await axios.post(`provider/orders/reject/${id}`, buildFormData({}), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const dispatchRetrievalOrder = async (payload) => {
    const res = await axios.post('provider/retrieval-orders/dispatch-order', buildFormData(payload), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const receivedFromCustomerReturnOrder = async (id) => {
    const res = await axios.post(`delegate/received-from-customer-return-order/${id}`, buildFormData({}), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  const getProviderDelegates = async () => {
    const res = await axios.get('provider/delegates/all', authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: Array.isArray(res?.data?.data) ? res.data.data : [],
      raw: res,
    };
  };

  const acceptToSendDelegateContact = async (id) => {
    const res = await axios.post(`accept-to-send-delegate-contact/${id}`, buildFormData({}), authConfig());
    return {
      ok: response(res) === 'success',
      key: res?.data?.key,
      msg: res?.data?.msg,
      data: res?.data?.data || null,
      raw: res,
    };
  };

  return {
    getNormalOrders,
    getRetrievalOrders,
    getNormalOrderDetails,
    getRetrievalOrderDetails,
    getOrderInvoice,
    sendOrUpdateOffer,
    calculateOfferVat,
    getProductsFromBaseProduct,
    getVariantsFromProduct,
    issueInvoice,
    preparedOrder,
    deliverToUserDelegate,
    rejectOrder,
    dispatchRetrievalOrder,
    receivedFromCustomerReturnOrder,
    getProviderDelegates,
    acceptToSendDelegateContact,
  };
}
