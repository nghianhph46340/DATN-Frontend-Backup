<template>
  <div>
    <div class="header-section">
      <h2>Thêm khách hàng</h2>
      <button class="btn btn-secondary btn-sm" @click="router.push('/admin/quanlykhachhang')">Quay lại</button>
    </div>
    <form @submit.prevent="themKhachHang" @reset.prevent="resetForm">
      <a-form :model="formData" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Họ tên khách hàng" :validate-status="errors.tenKhachHang ? 'error' : ''"
              :help="errors.tenKhachHang">
              <a-input v-model:value="formData.tenKhachHang" placeholder="Nhập tên khách hàng" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="Giới tính" :validate-status="errors.gioiTinh ? 'error' : ''" :help="errors.gioiTinh">
              <a-radio-group v-model:value="formData.gioiTinh">
                <a-radio :value="true">Nam</a-radio>
                <a-radio :value="false">Nữ</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="Ngày sinh" :validate-status="errors.ngaySinh ? 'error' : ''" :help="errors.ngaySinh">
              <a-date-picker v-model:value="formData.ngaySinh" format="DD/MM/YYYY" placeholder="Chọn ngày sinh"
                class="w-100" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="Số điện thoại" :validate-status="errors.soDienThoai ? 'error' : ''"
              :help="errors.soDienThoai">
              <a-input v-model:value="formData.soDienThoai" placeholder="Nhập số điện thoại" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="Email" :validate-status="errors.email ? 'error' : ''" :help="errors.email">
              <a-input v-model:value="formData.email" placeholder="Nhập email" />
            </a-form-item>
          </a-col>
        </a-row>

        <div v-for="(diaChi, index) in formData.diaChiList" :key="index" class="address-section">
          <h3>Địa chỉ {{ index + 1 }}</h3>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="Tỉnh/Thành phố"
                :validate-status="errors.diaChiErrors[index]?.tinhThanhPho ? 'error' : ''"
                :help="errors.diaChiErrors[index]?.tinhThanhPho">
                <a-select v-model:value="diaChi.tinhThanhPho" placeholder="Chọn Tỉnh/Thành phố"
                  @change="() => handleProvinceChange(index)">
                  <a-select-option v-for="province in provinces" :key="province.code" :value="province.name">
                    {{ province.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="6">
              <a-form-item label="Quận/Huyện" :validate-status="errors.diaChiErrors[index]?.quanHuyen ? 'error' : ''"
                :help="errors.diaChiErrors[index]?.quanHuyen">
                <a-select v-model:value="diaChi.quanHuyen" placeholder="Chọn Quận/Huyện"
                  :disabled="!diaChi.tinhThanhPho" @change="() => handleDistrictChange(index)">
                  <a-select-option v-for="district in districts[index]" :key="district.code" :value="district.name">
                    {{ district.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="6">
              <a-form-item label="Phường/Xã" :validate-status="errors.diaChiErrors[index]?.xaPhuong ? 'error' : ''"
                :help="errors.diaChiErrors[index]?.xaPhuong">
                <a-select v-model:value="diaChi.xaPhuong" placeholder="Chọn Phường/Xã" :disabled="!diaChi.quanHuyen">
                  <a-select-option v-for="ward in wards[index]" :key="ward.code" :value="ward.name">
                    {{ ward.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="5">
              <a-form-item label="Số nhà, tên đường" :validate-status="errors.diaChiErrors[index]?.soNha ? 'error' : ''"
                :help="errors.diaChiErrors[index]?.soNha">
                <a-input v-model:value="diaChi.soNha" placeholder="Số nhà, tên đường..." />
              </a-form-item>
            </a-col>

            <a-col :span="1">
              <a-form-item label="Mặc định">
                <a-checkbox v-model:checked="diaChi.diaChiMacDinh" @change="handleDefaultChange(index)" />
              </a-form-item>
            </a-col>
          </a-row>
          <button type="button" class="btn btn-danger" @click="xoaDiaChi(index)" v-if="formData.diaChiList.length > 1">
            Xóa địa chỉ
          </button>
        </div>

        <hr>
        <button type="button" class="btn btn-primary" @click="themDiaChi">+ Thêm địa chỉ khác</button>

        <div class="mt-4">
          <button type="btn buttonADD" class="btn btn-warning me-2" @click="confirmThemKhachHang">+ Tạo tài
            khoản</button>
          <button type="button" class="btn btn-secondary" @click="resetForm">Làm mới</button>
        </div>
      </a-form>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useGbStore } from '@/stores/gbStore';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';

const gbStore = useGbStore();
const router = useRouter();
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

const formData = reactive({
  maKhachHang: '',
  tenKhachHang: '',
  gioiTinh: null,
  soDienThoai: '',
  ngaySinh: null,
  email: '',
  trangThai: 'Đang hoạt động',
  diaChiList: [{
    soNha: '',
    xaPhuong: '',
    quanHuyen: '',
    tinhThanhPho: '',
    diaChiMacDinh: true
  }]
});

const errors = reactive({
  tenKhachHang: '',
  gioiTinh: '',
  ngaySinh: '',
  soDienThoai: '',
  email: '',
  diaChiErrors: [{}]
});

const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach(key => {
    if (key !== 'diaChiErrors') errors[key] = '';
  });
  errors.diaChiErrors = formData.diaChiList.map(() => ({}));

  if (!formData.tenKhachHang.trim()) {
    errors.tenKhachHang = 'Vui lòng nhập tên khách hàng';
    isValid = false;
  }

  if (formData.gioiTinh === null) {
    errors.gioiTinh = 'Vui lòng chọn giới tính';
    isValid = false;
  }

  if (!formData.ngaySinh) {
    errors.ngaySinh = 'Vui lòng nhập ngày sinh';
    isValid = false;
  } else {
    const ngaySinh = new Date(formData.ngaySinh);
    const now = new Date();
    const tuoi = now.getFullYear() - ngaySinh.getFullYear();
    if (tuoi < 13) {
      errors.ngaySinh = 'Khách hàng phải đủ 13 tuổi';
      isValid = false;
    }
  }

  if (!formData.soDienThoai.trim()) {
    errors.soDienThoai = 'Vui lòng nhập số điện thoại';
    isValid = false;
  } else if (!validatePhoneNumber(formData.soDienThoai)) {
    errors.soDienThoai = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = 'Vui lòng nhập email';
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email không hợp lệ (VD: example@gmail.com)';
    isValid = false;
  }

  formData.diaChiList.forEach((diaChi, index) => {
    if (!diaChi.tinhThanhPho) {
      errors.diaChiErrors[index].tinhThanhPho = 'Vui lòng chọn tỉnh/thành phố';
      isValid = false;
    }
    if (!diaChi.quanHuyen && diaChi.tinhThanhPho) {
      errors.diaChiErrors[index].quanHuyen = 'Vui lòng chọn quận/huyện';
      isValid = false;
    }
    if (!diaChi.xaPhuong && diaChi.quanHuyen) {
      errors.diaChiErrors[index].xaPhuong = 'Vui lòng chọn phường/xã';
      isValid = false;
    }
    if (!diaChi.soNha.trim()) {
      errors.diaChiErrors[index].soNha = 'Vui lòng nhập số nhà, tên đường';
      isValid = false;
    }
  });

  if (!formData.diaChiList.some(d => d.diaChiMacDinh) && formData.diaChiList.length > 0) {
    formData.diaChiList[0].diaChiMacDinh = true;
  }

  return isValid;
};

const validatePhoneNumber = (phone) => {
  const regex = /^(0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return regex.test(phone);
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email) && email.length <= 100;
};

const loadProvinces = async () => {
  try {
    const response = await fetch('https://provinces.open-api.vn/api/p/');
    provinces.value = await response.json();
  } catch (error) {
    console.error('Lỗi khi tải tỉnh/thành:', error);
  }
};

const handleProvinceChange = async (index) => {
  if (formData.diaChiList[index].tinhThanhPho) {
    try {
      const provinceCode = provinces.value.find(p => p.name === formData.diaChiList[index].tinhThanhPho)?.code;
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await response.json();
      districts.value[index] = data.districts;
      formData.diaChiList[index].quanHuyen = '';
      wards.value[index] = [];
    } catch (error) {
      console.error('Lỗi khi tải quận/huyện:', error);
    }
  }
};

const handleDistrictChange = async (index) => {
  if (formData.diaChiList[index].quanHuyen) {
    try {
      const districtCode = districts.value[index].find(d => d.name === formData.diaChiList[index].quanHuyen)?.code;
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await response.json();
      wards.value[index] = data.wards;
      formData.diaChiList[index].xaPhuong = '';
    } catch (error) {
      console.error('Lỗi khi tải phường/xã:', error);
    }
  }
};

const themDiaChi = () => {
  formData.diaChiList.push({
    soNha: '',
    xaPhuong: '',
    quanHuyen: '',
    tinhThanhPho: '',
    diaChiMacDinh: false
  });
  districts.value.push([]);
  wards.value.push([]);
  errors.diaChiErrors.push({});
};

const xoaDiaChi = (index) => {
  formData.diaChiList.splice(index, 1);
  districts.value.splice(index, 1);
  wards.value.splice(index, 1);
  errors.diaChiErrors.splice(index, 1);
  if (!formData.diaChiList.some(d => d.diaChiMacDinh) && formData.diaChiList.length > 0) {
    formData.diaChiList[0].diaChiMacDinh = true;
  }
};

const handleDefaultChange = (index) => {
  if (formData.diaChiList[index].diaChiMacDinh) {
    formData.diaChiList.forEach((diaChi, i) => {
      diaChi.diaChiMacDinh = (i === index);
    });
  } else if (!formData.diaChiList.some(d => d.diaChiMacDinh)) {
    formData.diaChiList[0].diaChiMacDinh = true;
  }
};



const resetForm = () => {
  Object.assign(formData, {
    maKhachHang: '',
    tenKhachHang: '',
    gioiTinh: null,
    soDienThoai: '',
    ngaySinh: null,
    email: '',
    trangThai: 'Đang hoạt động',
    diaChiList: [{
      soNha: '',
      xaPhuong: '',
      quanHuyen: '',
      tinhThanhPho: '',
      diaChiMacDinh: true
    }]
  });
  Object.keys(errors).forEach(key => {
    if (key !== 'diaChiErrors') errors[key] = '';
  });
  errors.diaChiErrors = [{}];
  districts.value = [[]];
  wards.value = [[]];
};

const themKhachHang = async () => {
  if (!validateForm()) {
    toast.error('Vui lòng điền đầy đủ và chính xác thông tin!');
    return;
  }

  const dataToSend = { ...formData };
  if (dataToSend.ngaySinh) {
    dataToSend.ngaySinh = new Date(dataToSend.ngaySinh).toISOString();
  }

  try {
    const result = await gbStore.themKhachHang(dataToSend);
    if (result) {
      toast.success('Thêm khách hàng thành công!', {
        autoClose: 2000,
        position: 'top-right'
      });
      setTimeout(() => {
        router.push('/admin/quanlykhachhang');
      }, 2000);
    }
  } catch (error) {
    console.error('Lỗi khi thêm khách hàng:', error);
    // Kiểm tra lỗi từ backend
    if (error.response && error.response.data && error.response.data.error) {
      if (error.response.data.error.includes('Email đã được sử dụng')) {
        errors.email = 'Email đã được sử dụng!';
      } else {
        toast.error(error.response.data.error); // Hiển thị lỗi khác từ backend
      }
    } else {
      toast.error('Có lỗi xảy ra khi thêm khách hàng');
    }
  }
};
const confirmThemKhachHang = () => {
  if (confirm('Bạn có chắc chắn muốn tạo tài khoản khách hàng này không?')) {
    themKhachHang();
  }
};

onMounted(async () => {
  await loadProvinces();
  districts.value = [[]];
  wards.value = [[]];
});
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-section h2 {
  margin: 0;
}

.btn-secondary {
  margin-left: auto;
}

.address-section {
  border: 1px solid #e8e8e8;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  position: relative;
}

.address-section h3 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #333;
}

.btn-danger {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>