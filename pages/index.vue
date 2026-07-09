<template>
    <section class="dashboard-page" dir="rtl">
        <div class="dashboard-shell">
            <div class="stats-grid">
                <article v-for="card in statCards" :key="card.title" class="stat-card">
                    <div class="stat-card__top">
                        <div class="stat-icon" :class="card.iconClass">
                            <img :src="card.iconSrc" :alt="card.title" class="stat-icon__image" />
                        </div>
                        <span class="stat-chip" :class="card.trend">
                            <span>{{ card.change }}</span>
                        </span>
                    </div>
                    <div class="stat-card__body">
                        <strong class="stat-value">{{ card.value }}</strong>
                        <span class="stat-label">{{ card.title }}</span>
                    </div>
                </article>
            </div>

            <div class="insights-grid">
                <article class="panel panel-chart">
                    <div class="panel-head">
                        <div>
                            <h2 class="panel-title">الطلبات اليومية</h2>
                            <p class="panel-subtitle">آخر 7 أيام</p>
                        </div>
                        <span class="panel-chip">هذا الأسبوع</span>
                    </div>

                    <div class="line-chart">
                        <svg viewBox="0 0 640 260" class="line-chart__svg" aria-hidden="true">
                            <defs>
                                <linearGradient id="ordersArea" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stop-color="#23b08f" stop-opacity="0.22" />
                                    <stop offset="100%" stop-color="#23b08f" stop-opacity="0" />
                                </linearGradient>
                            </defs>

                            <g class="line-chart__grid">
                                <line v-for="line in 4" :key="`h-${line}`" x1="0" :y1="line * 52" x2="640"
                                    :y2="line * 52" />
                                <line v-for="line in 6" :key="`v-${line}`" :x1="line * 106.6" y1="0" :x2="line * 106.6"
                                    y2="208" />
                            </g>

                            <path class="line-chart__area"
                                d="M0 138 C48 118 86 98 132 104 C184 110 214 136 264 122 C316 108 334 60 390 68 C438 76 470 104 520 86 C558 72 592 42 640 126 L640 208 L0 208 Z" />
                            <path class="line-chart__line"
                                d="M0 138 C48 118 86 98 132 104 C184 110 214 136 264 122 C316 108 334 60 390 68 C438 76 470 104 520 86 C558 72 592 42 640 126" />
                        </svg>

                        <div class="line-chart__labels">
                            <span v-for="day in weekDays" :key="day">{{ day }}</span>
                        </div>
                    </div>
                </article>

                <article class="panel panel-donut">
                    <div class="panel-head">
                        <div>
                            <h2 class="panel-title">المبيعات حسب الفئة</h2>
                            <p class="panel-subtitle">هذا الشهر</p>
                        </div>
                    </div>

                    <div class="donut-layout">
                        <div class="donut-chart"></div>

                        <div class="donut-legend">
                            <div v-for="item in categoryStats" :key="item.label" class="donut-legend__item">
                                <div class="donut-legend__meta">
                                    <span class="donut-legend__dot" :style="{ background: item.color }"></span>
                                    <span class="donut-legend__label">{{ item.label }}</span>
                                </div>
                                <span class="donut-legend__value">{{ item.value }}</span>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <article class="panel orders-panel">
                <div class="panel-head orders-panel__head">
                    <h2 class="panel-title">آخر الطلبات</h2>
                    <button type="button" class="show-all-btn">عرض الكل</button>
                </div>

                <div class="orders-table-wrap">
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>رقم الطلب</th>
                                <th>العميل</th>
                                <th>المدينة</th>
                                <th>التاريخ</th>
                                <th>المبلغ</th>
                                <th>الحالة</th>
                                <th>إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in recentOrders" :key="order.id">
                                <td class="order-id">#{{ order.id }}</td>
                                <td>{{ order.customer }}</td>
                                <td>{{ order.city }}</td>
                                <td>{{ order.date }}</td>
                                <td class="order-amount">{{ order.amount }}</td>
                                <td>
                                    <span class="status-badge" :class="order.statusClass">{{ order.status }}</span>
                                </td>
                                <td>
                                    <button type="button" class="details-btn">التفاصيل</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup>
definePageMeta({
    name: "Titles.home",
});

import { useI18n } from "vue-i18n";
import icon12 from "@/assets/images/static/Icon-12.svg";
import icon26 from "@/assets/images/static/Icon-26.svg";
import icon40 from "@/assets/images/static/Icon-40.svg";
import iconVector from "@/assets/images/static/Vector.svg";

const { t } = useI18n({ useScope: "global" });
const globalStore = useGlobalStore();

const statCards = [
    {
        title: "إجمالي الطلبات",
        value: "1,284",
        change: "+12.5%",
        trend: "is-positive",
        iconSrc: iconVector,
        iconClass: "icon-blue",
    },
    {
        title: "الإيرادات الشهرية",
        value: "248,500",
        change: "+8.2%",
        trend: "is-positive",
        iconSrc: icon40,
        iconClass: "icon-green",
    },
    {
        title: "الطلبات الحالية",
        value: "47",
        change: "+3 اليوم",
        trend: "is-positive",
        iconSrc: icon26,
        iconClass: "icon-cyan",
    },
    {
        title: "معدل الإنجاز",
        value: "94.3%",
        change: "-1.2%",
        trend: "is-negative",
        iconSrc: icon12,
        iconClass: "icon-mint",
    },
];

const weekDays = ["الجمعة", "الخميس", "الأربعاء", "الثلاثاء", "الاثنين", "الأحد", "السبت"];

const categoryStats = [
    { label: "مواد غذائية", value: "42%", color: "#123f6f" },
    { label: "مستلزمات صناعية", value: "28%", color: "#29aa8f" },
    { label: "منتجات زراعية", value: "18%", color: "#1d79c8" },
    { label: "أخرى", value: "12%", color: "#7ddcc0" },
];

const recentOrders = [
    {
        id: 1042,
        customer: "شركة أهلًا للتجارة",
        city: "الرياض",
        date: "07 April 2026",
        amount: "12,500",
        status: "جديد",
        statusClass: "is-new",
    },
    {
        id: 1041,
        customer: "مؤسسة الخليج",
        city: "جدة",
        date: "07 April 2026",
        amount: "8,200",
        status: "قيد التنفيذ",
        statusClass: "is-progress",
    },
    {
        id: 1040,
        customer: "شركة النجمة الذهبية",
        city: "الدمام",
        date: "07 April 2026",
        amount: "34,000",
        status: "مكتمل",
        statusClass: "is-complete",
    },
];

onMounted(() => {
    globalStore.title = t("Sidebar.home");
});
</script>

<style scoped lang="scss">
.dashboard-page {
    direction: rtl;
}

.dashboard-shell {
    display: grid;
    gap: 22px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
}

.stat-card,
.panel {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 12px 30px rgba(13, 52, 94, 0.05);
}

.stat-card {
    padding: 14px 16px 18px;
    min-height: 128px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #f4f7fb;
}

.stat-card__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
}

.stat-chip {
    min-height: 24px;
    padding: 0 10px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
}

.stat-chip::before {
    font-size: 10px;
    line-height: 1;
}

.stat-chip.is-positive {
    background: #e8f7f2;
    color: #25a587;
}

.stat-chip.is-positive::before {
    content: "▲";
}

.stat-chip.is-negative {
    background: #fdeceb;
    color: #df5c55;
}

.stat-chip.is-negative::before {
    content: "▼";
}

.stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: inset 0 0 0 1px rgba(20, 73, 120, 0.04);
}

.stat-icon__image {
    width: 18px;
    height: 18px;
    display: block;
    object-fit: contain;
}

.icon-blue {
    background: #eff5fd;
    color: #356aab;
}

.icon-green {
    background: #edf9f3;
    color: #2a9f85;
}

.icon-cyan {
    background: #f2f7fd;
    color: #3c89d0;
}

.icon-mint {
    background: #edf9f3;
    color: #31b196;
}

.stat-card__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

.stat-value {
    color: #174978;
    font-size: 22px;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: -0.03em;
}

.stat-label {
    color: #9ba8b4;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
}

.insights-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.95fr);
    gap: 18px;
}

.panel {
    padding: 24px;
}

.panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
}

.panel-title {
    margin: 0;
    color: #202935;
    font-size: 28px;
    font-weight: 800;
    line-height: 1.2;
}

.panel-subtitle {
    margin: 6px 0 0;
    color: #c1cad4;
    font-size: 14px;
    font-weight: 600;
}

.panel-chip {
    min-height: 30px;
    padding: 0 14px;
    border-radius: 999px;
    background: #edf4fb;
    color: #4274a5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
}

.line-chart {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.line-chart__svg {
    width: 100%;
    height: auto;
    display: block;
}

.line-chart__grid line {
    stroke: #eef3f7;
    stroke-width: 1;
    stroke-dasharray: 4 6;
}

.line-chart__area {
    fill: url(#ordersArea);
}

.line-chart__line {
    fill: none;
    stroke: #23b08f;
    stroke-width: 3;
    stroke-linecap: round;
}

.line-chart__labels {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    color: #c4ccd6;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
}

.donut-chart {
    width: 190px;
    height: 190px;
    margin: 0 auto 30px;
    border-radius: 50%;
    background: conic-gradient(#123f6f 0 42%,
            #29aa8f 42% 70%,
            #1d79c8 70% 88%,
            #7ddcc0 88% 100%);
    position: relative;
}

.donut-chart::after {
    content: "";
    position: absolute;
    inset: 22px;
    background: #fff;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px #eff4f8;
}

.donut-legend {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.donut-legend__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    color: #2e3e51;
    font-size: 15px;
    font-weight: 700;
}

.donut-legend__meta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #697b8d;
    font-weight: 600;
}

.donut-legend__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex: 0 0 10px;
}

.orders-panel {
    padding-top: 18px;
}

.orders-panel__head {
    margin-bottom: 16px;
}

.orders-panel .panel-title {
    font-size: 22px;
}

.show-all-btn {
    border: 0;
    background: transparent;
    color: #174978;
    font-size: 18px;
    font-weight: 700;
    padding: 0;
}

.orders-table-wrap {
    overflow-x: auto;
}

.orders-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 820px;
}

.orders-table thead th {
    background: #edf4fb;
    color: #346799;
    font-size: 13px;
    font-weight: 700;
    padding: 18px 20px;
    white-space: nowrap;
}

.orders-table thead th:first-child {
    border-top-right-radius: 16px;
}

.orders-table thead th:last-child {
    border-top-left-radius: 16px;
}

.orders-table tbody td {
    padding: 14px 20px;
    color: #394a5c;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #eef3f7;
    white-space: nowrap;
}

.orders-table tbody tr:last-child td {
    border-bottom: 0;
}

.order-id,
.order-amount {
    color: #174978;
    font-weight: 800;
}

.status-badge {
    min-height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
}

.status-badge.is-new {
    background: #e8f1ff;
    color: #4f86d4;
}

.status-badge.is-progress {
    background: #fff4da;
    color: #eea826;
}

.status-badge.is-complete {
    background: #e6f8f1;
    color: #2ca981;
}

.details-btn {
    min-width: 92px;
    min-height: 40px;
    border: 1px solid #174978;
    border-radius: 12px;
    background: transparent;
    color: #174978;
    font-size: 13px;
    font-weight: 700;
}

@media (max-width: 1200px) {
    .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .insights-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 767px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .panel,
    .stat-card {
        border-radius: 20px;
    }

    .stat-value {
        font-size: 20px;
    }

    .panel-title {
        font-size: 22px;
    }

    .donut-layout {
        grid-template-columns: 1fr;
    }

    .donut-chart {
        width: 170px;
        height: 170px;
    }

    .orders-table {
        min-width: 720px;
    }
}
</style>
