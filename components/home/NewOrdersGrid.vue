<template>
    <div class="orders-grid">
        <article v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-top">
                <button type="button" class="calendar-btn" aria-label="calendar">
                    <!-- <i class="fa-regular fa-calendar-check"></i> -->
                    <img src="@/assets/images/auth-img/package-open.svg" alt="">
                </button>
                <div class="order-meta">
                    <span class="meta-item">رقم الطلب : {{ order.order_num }}</span>
                    <div class="d-flex align-items-center gap-1">
                        <i class="fas fa-clock main_color"></i>
                        <span class="meta-item">{{ order.created_at }}</span>
                    </div>
                </div>
            </div>

            <div class="order-body">
                <div class="order-line">
                    <img src="@/assets/images/service.svg" alt=""> {{ order.main_category }} / {{ order.sub_category }}
                </div>
            </div>

            <div class="order-actions">
                <button type="button" class="accept-btn" @click="$emit('accept', order)">قبول</button>
                <button type="button" class="reject-btn" :disabled="rejectLoadingId === order.id"
                    @click="$emit('reject', order)">
                    <span v-if="rejectLoadingId !== order.id">رفض</span>
                    <span v-else class="spinner-border spinner-border-sm m-0" role="status" aria-hidden="true"></span>
                </button>
            </div>
        </article>
    </div>
</template>

<script setup>
defineProps({
    orders: {
        type: Array,
        default: () => [],
    },
    rejectLoadingId: {
        type: [Number, String],
        default: null,
    },
});

defineEmits(["reject", "accept"]);
</script>

<style scoped lang="scss">
.orders-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
}

.order-card {
    background: #f4f4f4;
    border: 1px solid #d2d2d2;
    border-radius: 5px;
    padding: 9px;
}

.order-top {
    display: flex;
    gap: 10px;
    margin-bottom: 7px;
}

.order-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #7d7d7d;
    font-size: 10px;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
}

.meta-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2f5da8;
}

.calendar-btn {
    width: 33px;
    height: 33px;
    border: none;
    border-radius: 6px;
    background: #2f5da8;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.order-body {
    margin-bottom: 9px;
}

.order-line {
    margin: 0 0 4px;
    color: #2a2a2a;
    font-size: 11px;
    font-weight: 500;
}

.order-line i {
    color: #2f5da8;
    font-size: 11px;
}

.order-actions {
    display: flex;
    gap: 8px;
}

.accept-btn,
.reject-btn {
    flex: 1;
    min-height: 28px;
    border-radius: 5px;
    border: none;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.accept-btn {
    background: #2f5da8;
    color: #fff;
}

.reject-btn {
    background: #ecd1d4;
    color: #d45d67;
}

.reject-btn:disabled {
    opacity: 0.8;
    cursor: not-allowed;
}

@media (max-width: 1199px) {
    .orders-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 991px) {
    .orders-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .orders-grid {
        grid-template-columns: 1fr;
    }
}
</style>
