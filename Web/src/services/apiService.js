import axios from 'axios';
const API_BASE_URL = window.APP_CONFIG.REACT_APP_API_BASE_URL; 
 
const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (optional, for adding dynamic headers like tokens)
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional, for global error handling or data transformation)
apiService.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
      
    // Handle specific error codes, e.g., redirect to login on 401
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access. Redirecting to login...');
      // Implement redirection logic
      localStorage.removeItem('token'); 
      window.location.href = '/ ';
    }
    return Promise.reject(error);
  }
);

const UserService = {
  login: (userData) => apiService.post('/user/login', userData), 
  checkToken: () => apiService.get('/user/checktoken'),
  getUserById: (id) => apiService.get(`/user/getuserbyid/${id}`), 
}; 
  
const DatasetService = { 
  getRecordByColumn:(params) => apiService.post('/dataset/getrecodbycolumn', params), 
  getColumnList: (tblname) => apiService.get(`/dataset/getcolumnlist/${tblname}`), 
  getDatasetRecord: (tblname) => apiService.get(`/dataset/getdatasetrecord/${tblname}`), 
  getDatasetList: () => apiService.get(`/dataset/getdatasetlist`), 
  saveDataset:(tickerdata) => apiService.post('/dataset/savedataset', tickerdata), 
  updateDatasetRecord:(tickerdata) => apiService.post('/dataset/updatedatasetrecord', tickerdata),  
};

const WidgetService = { 
  getWidgetList: () => apiService.get(`/widget/getwidgetlist`), 
  getWidgetData:(id) => apiService.get(`/widget/getwidgetdata/${id}`), 
  saveWidget:(widgetdata) => apiService.post('/widget/savewidget', widgetdata), 
  updateWidgetRecord:(widgetdata) => apiService.post('/widget/updatewidgetrecord', widgetdata),  
  deleteWidgetRecord:(widgetdata) => apiService.post('/widget/deletewidgetrecord', widgetdata) 
};

const ReportService = { 
  getReportList: () => apiService.get(`/report/getreportlist`), 
  getReportData:(id) => apiService.get(`/report/getreportdata/${id}`), 
  saveReport:(reportdata) => apiService.post('/report/savereport', reportdata), 
  updateReportRecord:(widgetdata) => apiService.post('/report/updatereportrecord', widgetdata),  
  deleteReportRecord:(widgetdata) => apiService.post('/report/deletereportrecord', widgetdata) 
};
 
export { 
  UserService, 
  DatasetService,
  WidgetService,
  ReportService
};