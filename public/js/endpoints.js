export { 
    getIncomes,
    getExpenses,
    getIncomeCategories,
    getExpenseCategories,
    getPaymentOptions,
    addIncome,
    addExpense,
    addIncomeCategory,
    addExpenseCategory,
    addPaymentOption,
    deleteIncome,
    deleteExpense,
    deleteIncomeCategory,
    deleteExpenseCategory,
    deletePaymentOption,
    modifyIncome,
    modifyExpense,
    modifyIncomeCategory,
    modifyExpenseCategory,
    modifyPaymentOption
}

const URL_GET_INCOMES = '/income/get';
const URL_ADD_INCOME = '/income/add';
const URL_DELETE_INCOME = '/income/delete/{id}';
const URL_MODIFY_INCOME = '/income/modify/{id}';

const URL_GET_EXPENSES = '/expense/get';
const URL_ADD_EXPENSE = '/expense/add';
const URL_DELETE_EXPENSE = '/expense/delete/{id}';
const URL_MODIFY_EXPENSE = '/expense/modify/{id}';

const URL_GET_INCOME_CATEGORIES = '/income-category/get';
const URL_ADD_INCOME_CATEGORY = '/income-category/add';
const URL_DELETE_INCOME_CATEGORY = '/income-category/delete/{id}';
const URL_MODIFY_INCOME_CATEGORY = '/income-category/modify/{id}';

const URL_GET_EXPENSE_CATEGORIES = '/expense-category/get';
const URL_ADD_EXPENSE_CATEGORY = '/expense-category/add';
const URL_DELETE_EXPENSE_CATEGORY = '/expense-category/delete/{id}';
const URL_MODIFY_EXPENSE_CATEGORY = '/expense-category/modify/{id}';

const URL_GET_PAYMENT_OPTIONS = '/payment-option/get';
const URL_ADD_PAYMENT_OPTION = '/payment-option/add';
const URL_DELETE_PAYMENT_OPTION = '/payment-option/delete/{id}';
const URL_MODIFY_PAYMENT_OPTION= '/payment-option/modify/{id}';


// Endpoints of INCOMES
const getIncomes = async (dateFrom=null, dateTo=null) => {
    const params = {};
    if (dateFrom !== null) params['dateFrom'] = dateFrom;
    if (dateTo !== null) params['dateTo'] = dateTo;
    return await _sendRequest("GET", URL_GET_INCOMES, params);

    
    // if (dateFrom !== null) params.push(['dateFrom', dateFrom]);
    // if (dateTo !== null) params.push(['dateTo', dateTo]);

    const config = {
      method: 'get', // You can specify other HTTP methods here if needed
      url: URL_GET_INCOMES,
      params
    };
    const response = await axios(config);
    return response.data;



    // const searchParams = new URLSearchParams(params);

    // return await _sendRequest("GET", URL_GET_INCOMES, searchParams);
}


const addIncome = async (form) => {
    return await _postFormRequest(URL_ADD_INCOME, form);
}


const deleteIncome = async (id) => {
    return await _sendRequest("POST", URL_DELETE_INCOME.replace('{id}', id));
}


const modifyIncome = async (id, form) => {
    return await _postFormRequest(URL_MODIFY_INCOME.replace('{id}', id), form);
}


// ENDPOINTS for EXPENSES
const getExpenses = async (dateFrom=null, dateTo=null) => {
    const params = {};
    if (dateFrom !== null) params['dateFrom'] = dateFrom;
    if (dateTo !== null) params['dateTo'] = dateTo;
    return await _sendRequest("GET", URL_GET_EXPENSES, params);
}


const addExpense = async (form) => {
    return await _postFormRequest(URL_ADD_EXPENSE, form);
}


const deleteExpense = async (id) => {
    return await _sendRequest("POST", URL_DELETE_EXPENSE.replace('{id}', id));
}


const modifyExpense = async (id, form) => {
    return await _postFormRequest(URL_MODIFY_EXPENSE.replace('{id}', id), form);
}


// ENDPOINTS for INCOME CATEGORIES
const getIncomeCategories = async () => {
    return await _sendRequest("GET", URL_GET_INCOME_CATEGORIES);
}


const addIncomeCategory = async (form) => {
    return await _postFormRequest(URL_ADD_INCOME_CATEGORY, form);
}


const deleteIncomeCategory = async (id) => {
    return await _sendRequest("POST", URL_DELETE_INCOME_CATEGORY.replace('{id}', id));
}


const modifyIncomeCategory = async (id, form) => {
    return await _postFormRequest(URL_MODIFY_INCOME_CATEGORY.replace('{id}', id), form);
}


// ENDPOINTS for EXPENSE CATEGORIES
const getExpenseCategories = async () => {
    return await _sendRequest("GET", URL_GET_EXPENSE_CATEGORIES);
}


const addExpenseCategory = async (form) => {
    return await _postFormRequest(URL_ADD_EXPENSE_CATEGORY, form);
}


const deleteExpenseCategory = async (id) => {
    return await _sendRequest("POST", URL_DELETE_EXPENSE_CATEGORY.replace('{id}', id));
}


const modifyExpenseCategory = async (id, form) => {
    return await _postFormRequest(URL_MODIFY_EXPENSE_CATEGORY.replace('{id}', id), form);
}


// ENDPOINTS for PAYMENT OPTIONS
const getPaymentOptions = async () => {
    return await _sendRequest("GET", URL_GET_PAYMENT_OPTIONS);
}


const addPaymentOption = async (form) => {
    return await _postFormRequest(URL_ADD_PAYMENT_OPTION, form);
}


const deletePaymentOption = async (id) => {
    return await _sendRequest("POST", URL_DELETE_PAYMENT_OPTION.replace('{id}', id));
}


const modifyPaymentOption = async (id, form) => {
    return await _postFormRequest(URL_MODIFY_PAYMENT_OPTION.replace('{id}', id), form);
}


const _sendRequest = async (method, url, params = {}) => {
    try {
        const response = await axios({
            method: method,
            url: url,
            params
          });
        return response.data;
    } catch (error) {
        const result = {'status': 'error'}
        if (error.response.data.errorMessage) {
            result['errorMessage'] = error.response.data.errorMessage;
        } else {
            result['errorMessage'] = `Unexpected error when fetching data from ${url}. Error: ${error.response.data}`;
        }
        return result;
    }
};


const _postFormRequest = async (url, form) => {
    try {
        const formData = new FormData(form);
        const response = await axios.postForm(url, formData);
        return response.data;
    } catch (error) {
        const result = {'status': 'error'}
        if (error.response.data.errorMessage) {
            result['errorMessage'] = error.response.data.errorMessage;
        } else {
            result['errorMessage'] = `Unexpected error when fetching data from ${url}. Error: ${error.response.data}`;
        }
        return result;
    }
};
