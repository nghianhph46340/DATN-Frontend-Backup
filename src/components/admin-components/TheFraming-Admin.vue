<template>
    <a-layout class="" style="min-height: 100vh">
        <a-layout-sider class="sider " v-model:collapsed="collapsed" :trigger="null" collapsible theme="light">
            <div class="logo p-3 " style="text-align: center;">
                <img class="w-50 " src="../../images/logo/logo2.png" alt="Logo" />
            </div>

            <a-menu class="" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="light"
                mode="inline">

                <a-menu-item key="2" @click="changeRoute('/admin/baocaothongke')">
                    <AreaChartOutlined />
                    <span>Thống kê</span>
                </a-menu-item>
                <a-menu-item key="1" @click="changeRoute('/admin');">
                    <HomeOutlined />
                    <span>Bán hàng</span>
                </a-menu-item>
                <a-sub-menu key="sub1">
                    <template #title>
                        <span>
                            <ReconciliationOutlined />
                            <span>Sản phẩm</span>
                        </span>
                    </template>
                    <a-menu-item key="3" @click="changeRoute('/admin/quanlysanpham');">Tất cả
                        sản
                        phẩm</a-menu-item>
                    <a-menu-item key="4" @click="changeRoute('/admin/quanlysanpham/sanpham');">Sản phẩm</a-menu-item>
                    <a-menu-item key="5" @click="changeRoute('/admin/quanlysanpham/chitietsanpham');">Biến thể sản
                        phẩm</a-menu-item>
                    <!-- <a-menu-item key="6">Thuộc tính</a-menu-item> -->
                    <a-menu-item key="7" @click="changeRoute('/admin/quanlysanpham/thuoctinh');">Thuộc
                        tính</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="8" @click="changeRoute('/admin/quanlyhoadon');">
                    <AccountBookOutlined />
                    <span>Hóa đơn</span>
                </a-menu-item>
                <a-sub-menu key="sub2">
                    <template #title>
                        <span>
                            <user-outlined />
                            <span>Tài khoản</span>
                        </span>
                    </template>
                    <a-menu-item key="10" @click="changeRoute('/admin/quanlynhanvien');">Nhân viên</a-menu-item>
                    <a-menu-item key="11" @click="changeRoute('/admin/quanlykhachhang');">Khách hàng</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub3">
                    <template #title>
                        <span>
                            <ReconciliationOutlined />
                            <span>Ưu đãi</span>
                        </span>
                    </template>
                    <a-menu-item key="12" @click="changeRoute('/admin/quanlyvoucher');">Voucher</a-menu-item>
                    <a-menu-item key="13" @click="changeRoute('/admin/quanlykhuyenmai');">Khuyến mãi</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="14">
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header class="sticky-top d-flex align-items-center justify-content-evenly pe-4 header-admin"
                style="background: #fff; padding: 0; z-index: 1;">
                <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                <TheSearchAdmin />
                <div class="">

                    <TheAvatarAdmin />
                </div>
            </a-layout-header>
            <a-layout-content class="content-admin" style="margin: 16px 16px">

                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px', borderRadius: '10px' }">
                    <router-view></router-view>
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                G-B Sports ©2024 Created by GB-Sports
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script setup>

import { computed, onMounted, ref, watch } from 'vue';
import { HomeOutlined, AreaChartOutlined, UserOutlined, ReconciliationOutlined, MenuUnfoldOutlined, MenuFoldOutlined, LaptopOutlined, LogoutOutlined, AccountBookOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import TheAvatarAdmin from './TheAvatar-Admin.vue';
import TheSearchAdmin from './TheSearch-Admin.vue';
import { useGbStore } from '@/stores/gbStore';
import { useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const store = useGbStore();
const collapsed = ref(false);
const selectedKeys = ref([store.indexMenu]);
console.log(selectedKeys);

// Quản lý các sub-menu đang mở
const openKeys = ref([]);

// Hàm cập nhật openKeys dựa trên route hiện tại
const updateOpenKeys = () => {
    // Kiểm tra đường dẫn hiện tại và quyết định sub-menu nào nên được mở
    const path = route.path;
    const keysToOpen = [];

    // Nếu đường dẫn chứa /quanlysanpham, mở sub-menu sản phẩm
    if (path.includes('/quanlysanpham')) {
        keysToOpen.push('sub1');
    }

    // Nếu đường dẫn chứa /quanlynhanvien hoặc /quanlykhachhang, mở sub-menu tài khoản
    if (path.includes('/quanlynhanvien') || path.includes('/quanlykhachhang')) {
        keysToOpen.push('sub2');
    }

    // Nếu đường dẫn chứa /quanlyvoucher hoặc /quanlykhuyenmai, mở sub-menu ưu đãi
    if (path.includes('/quanlyvoucher') || path.includes('/quanlykhuyenmai')) {
        keysToOpen.push('sub3');
    }

    // Chỉ cập nhật nếu không bị thu gọn
    if (!collapsed.value) {
        openKeys.value = keysToOpen;
    }
};

const changeRoute = (path) => {
    store.getPath(path);
    store.getIndex(path);
    router.push(path);
    console.log(store.checkRouter);
    // Cập nhật openKeys khi thay đổi route
    setTimeout(() => {
        updateOpenKeys();
    }, 100);
};

// Theo dõi sự thay đổi của route
watch(() => route.path, (newPath) => {
    updateOpenKeys();
}, { immediate: true });

// Theo dõi sự thay đổi của collapsed
watch(collapsed, (newValue) => {
    // Nếu sidebar mở rộng, cập nhật lại openKeys
    if (!newValue) {
        updateOpenKeys();
    } else {
        // Khi thu gọn, đóng tất cả submenu
        openKeys.value = [];
    }
});

onMounted(() => {
    store.getIndex(route.path);
    selectedKeys.value = store.indexMenu;
    updateOpenKeys();
})
</script>
<style scoped>
:deep(.ant-menu-item-selected) {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    background-color: #343434 !important;
    color: white !important;
}

:deep(.ant-menu-light .ant-menu-submenu-selected>.ant-menu-submenu-title) {
    color: #030303 !important;
}

#components-layout-demo-sider .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 253, 253, 0.3);
}

.site-layout .site-layout-background {
    background: #010101;
}

[data-theme='light'] .site-layout .site-layout-background {
    background: #484848;
}

#title-page {
    background-color: #484848;
    color: white;
}

.trigger {
    font-size: 20px;
    margin-left: 1rem;
}

/* Thiết lập thanh menu đứng yên và cố định vị trí */
.sider {
    position: fixed !important;
    height: 100vh;
    overflow-y: auto;
    left: 0;
    top: 0;
    z-index: 100;
}

/* Điều chỉnh lại layout chính để đảm bảo nội dung không bị đè */
:deep(.ant-layout) {
    padding-left: v-bind('collapsed ? "80px" : "200px"');
    transition: padding-left 0.2s;
}

.header-admin {
    /* box-shadow: 0 0 50px rgba(0, 0, 0, 0.6); */
    border-bottom-right-radius: 10px;
    box-shadow: 0 4px 10px -5px rgba(122, 122, 122, 0.6);
    /* filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.6)); */
    position: sticky;
    top: 0;
    z-index: 99;
}

.content-admin {
    box-shadow: 0 0 10px rgba(207, 207, 207, 0.6);
    border-radius: 10px;
}

.logo {
    /* border-bottom: 1px solid rgba(207, 207, 207, 0.6); */
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
}
</style>