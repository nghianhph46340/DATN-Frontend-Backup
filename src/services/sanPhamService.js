import axiosInstance from '@/config/axiosConfig'
// import { toast } from "vue3-toastify/index";
//Hàm xử lý dữ liệu
const qlsp = 'admin/quan_ly_san_pham/'
const getAllSanPham = async () => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'SanPham')
    return data
  } catch (error) {
    console.log(error)
    console.log('Không lấy được danh sách sản phẩm')
  }
}

const getAllChiTietSanPham = async () => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'getAllCTSP')
    return data
  } catch (error) {
    console.log(error)
    console.log('Không lấy được danh sách chi tiết sản phẩm')
  }
}
const searchChiTietSanPham = async (search) => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'searchCTSP?keywork=' + search)
    console.log('Datasearch', data)
    return data
  } catch (error) {
    console.log(error)
    console.log('Không lấy được danh sách chi tiết sản phẩm')
  }
}

const getImageInCTSP = async (id, anhChinh) => {
  try {
    const { data } = await axiosInstance.get(
      qlsp + 'HinhAnhSanPham?idCTSP=' + id + '&anhChinh=' + anhChinh,
    )
    return data
  } catch (error) {
    console.log(error)
    // toast.error('Không lấy được hình anh')
  }
}
const getCTSPBySanPham = async (id) => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'CTSPTheoSanPham?id=' + id)
    return data
  } catch (error) {
    console.log(error)
  }
}
const changeStatusSanPham = async (id) => {
  try {
    const { data } = await axiosInstance.put(qlsp + 'chuyenTrangThaiSanPham?id=' + id)
    return data
  } catch (error) {
    console.log(error)
  }
}

// Hàm cập nhật trạng thái cho tất cả chi tiết sản phẩm theo sản phẩm chính
const updateCTSPStatusBySanPham = async (id, status) => {
  try {
    const { data } = await axiosInstance.put(qlsp + 'updateCTSPStatusBySanPham', {
      id_san_pham: id,
      trang_thai: status,
    })
    return data
  } catch (error) {
    console.log('Lỗi khi cập nhật trạng thái CTSP:', error)
    throw error
  }
}

const getDanhMucList = async () => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'DanhMuc')
    return data
  } catch (error) {
    console.log(error)
  }
}
const getThuongHieuList = async () => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'ThuongHieu')
    return data
  } catch (error) {
    console.log(error)
  }
}
const getChatLieuList = async () => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'ChatLieu')
    return data
  } catch (error) {
    console.log(error)
  }
}
const getMauSacList = async () => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'MauSac')
    return data
  } catch (error) {
    console.log(error)
  }
}
const getSizeList = async () => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'Size')
    return data
  } catch (error) {
    console.log(error)
  }
}

const createSanPhams = async (data) => {
  try {
    console.log('Data gửi đi:', data)
    const response = await axiosInstance.post(qlsp + 'saveSanPham', data)
    console.log('Response từ server:', response)
    return response.data
  } catch (error) {
    console.error('Chi tiết lỗi:', error)
    throw error
  }
}
const createCTSP = async (data) => {
  try {
    console.log('Data CTSP gửi đi:', data)
    const response = await axiosInstance.post(qlsp + 'saveCTSP', data)
    return response.data
  } catch (error) {
    console.log('Lỗi thêm chi tiết sản phẩm', error)
    throw error
  }
}

// Hàm lấy ngày hiện tại theo định dạng yyyy-MM-dd
const getCurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Hàm lấy ngày giờ hiện tại đầy đủ
const getCurrentDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const importSanPhamFromExcel = async (file) => {
  try {
    console.log('Service processing file:', file);
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size, 'bytes');

    // Ensure we have a valid File object
    if (!(file instanceof File) && !(file instanceof Blob)) {
      console.error('Invalid file object:', file);
      throw new Error('Invalid file object provided');
    }

    const formData = new FormData();
    formData.append('file', file);

    // Log form data entries for debugging
    for (let pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1]);
    }

    const response = await axiosInstance.post(qlsp + 'listImport', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.log('Excel import error:', error);
    console.log('Error response:', error.response?.data);
    throw error;
  }
}
const saveExcelImports = async (data) => {
  try {
    const response = await axiosInstance.post(qlsp + 'save', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu Excel:', error)
    return {
      error: true,
      message: error.message || 'Có lỗi xảy ra khi lưu dữ liệu Excel',
    }
  }
}
const getSanPhamById = async (id) => {
  try {
    const response = await axiosInstance.get(qlsp + 'sanPhamDetail?id=' + id)
    // Lấy dữ liệu từ response.data vì đây là một object đơn lẻ
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
    return {
      error: true,
      message: error.message || 'Có lỗi xảy ra khi lấy chi tiết sản phẩm',
    }
  }
}
const getSanPhamBySanPham = async (tenSanPham) => {
  try {
    const response = await axiosInstance.get(
      qlsp + 'getSanPhamByTenSanPham?tenSanPham=' + tenSanPham,
    )
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
    return {
      error: true,
      message: error.message || 'Có lỗi xảy ra khi lấy chi tiết sản phẩm',
    }
  }
}
const getAllCTSPKM = async () => {
  try {
    const response = await axiosInstance.get(qlsp + 'getAllCTSPKM')
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm khuyến mãi:', error)
    return {
      error: true,
      message: error.message || 'Có lỗi xảy ra khi lấy chi tiết sản phẩm khuyến mái',
    }
  }
}
const getCTSPBySanPhamFull = async (idSanPham) => {
  try {
    const response = await axiosInstance.get(qlsp + 'CTSPBySanPhamFullWeb?idSanPham=' + idSanPham)
    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
    return {
      error: true,
      message: error.message || 'Có lỗi xảy ra khi lấy chi tiết sản phẩm',
    }
  }
}
const getAllSanPhamNgaySua = async () => {
  try {
    const { data } = await axiosInstance.get(qlsp + 'sanPhamTheoNgaySua')
    return data
  } catch (error) {
    console.log(error)
    console.log('Không lấy được danh sách sản phẩm')
  }
}
const searchSanPham = async (search) => {
  try {
    const response = await axiosInstance.get(qlsp + 'timKiemSanPham?search=' + search)
    console.log('Data search sản phẩm:', response.data)
    return response.data
  } catch (error) {
    console.log(error)
    console.log('Không lấy được danh sách sản phẩm theo từ khóa')
    return { error: true, data: [] }
  }
}

const exportExcel = async (productIds, fields) => {
  try {
    const response = await axiosInstance.post(qlsp + 'exportExcel',
      {
        productIds: productIds,
        fields: fields
      },
      {
        responseType: 'blob', // Quan trọng để nhận dữ liệu dạng file
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error);
    throw error;
  }
}

export const sanPhamService = {
  getAllSanPham,
  getAllChiTietSanPham,
  getImageInCTSP,
  searchChiTietSanPham,
  getCTSPBySanPham,
  changeStatusSanPham,
  updateCTSPStatusBySanPham,
  getDanhMucList,
  getThuongHieuList,
  getChatLieuList,
  getMauSacList,
  getSizeList,
  createSanPhams,
  createCTSP,
  getCurrentDate,
  getCurrentDateTime,
  importSanPhamFromExcel,
  saveExcelImports,
  getSanPhamById,
  getSanPhamBySanPham,
  getCTSPBySanPhamFull,
  getAllSanPhamNgaySua,
  getAllCTSPKM,
  searchSanPham,
  exportExcel,
}
