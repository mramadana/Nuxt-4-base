<template>
  <div>
    <h1>Order Details</h1>
  </div>
</template>

<script setup>
definePageMeta({
  name: "Titles.order_details",
});


</script>

<style scoped lang="scss">
.preparing-screen {
  background: #ededed;
  min-height: calc(100vh - 240px);
  border-top: 1px solid #d9d9d9;
  padding: 20px 0 48px;
}

.preparing-container {
  max-width: 920px;
  margin: 0 auto;
}

.preparing-head {
  margin-bottom: 20px;
}

.preparing-title {
  margin: 0;
  color: #2c58a2;
  font-size: 22px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.title-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2c58a2;
}

.truck-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
}

.truck-img {
  width: 250px;
  max-width: 100%;
  height: auto;
}

.preparing-card {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 12px;
}

.card-title {
  margin: 0;
  color: #272727;
  font-size: 18px;
  font-weight: 500;
  text-align: right;
}

.card-divider {
  border-top: 1px solid #ececec;
  margin: 8px 0 12px;
}

.product-images-row {
  display: flex;
  gap: 16px;
}

.product-thumb,
.sent-product-thumb {
  width: 80px;
  height: 70px;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  overflow: hidden;
}

.product-thumb img,
.sent-product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sent-product-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: start;
}

.sent-product-info {
  text-align: right;
}

.product-name {
  color: #2c58a2;
  font-size: 16px;
  text-decoration: underline;
  margin-bottom: 8px;
  display: inline-block;
}

.product-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.product-qty {
  color: #1a1a1a;
  font-size: 16px;
}

.details-card {
  padding-bottom: 18px;
}

.details-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 10px;
  column-gap: 24px;
  align-items: center;
}

.detail-label {
  color: #666;
  font-size: 16px;
  text-align: right;
}

.detail-value {
  color: #1a1a1a;
  font-size: 16px;
  text-align: end;
}

.location-val i {
  color: #2c58a2;
  margin-inline-start: 6px;
}

.summary-grid .total-label {
  color: #1a1a1a;
  font-weight: 600;
}

.summary-grid .total-value {
  color: #2c58a2;
  font-size: 20px;
  font-weight: 600;
}

.text-card .card-title {
  margin-bottom: 0;
}

.text-details {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.7;
  text-align: right;
}

.client-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.client-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1a1a1a;
  font-size: 14px;
}

.client-item i {
  color: #2c58a2;
}

.review-content {
  padding: 8px 4px 18px;
}

.review-head {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 12px;
}

.review-name {
  margin: 0;
  color: #222;
  font-size: 20px;
  font-weight: 700;
}

.review-stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ffc12e;
  font-size: 14px;
}

.review-stars .muted {
  color: #d8d8d8;
}

.review-comment {
  max-width: 720px;
  margin: 0 auto;
  color: #666;
  font-size: 18px;
  line-height: 1.8;
}

.review-empty {
  margin: 0;
  color: #666;
  text-align: center;
  font-size: 16px;
}

.driver-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.driver-thumb {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  border: 1px solid #dadada;
  overflow: hidden;
}

.driver-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.driver-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.driver-name,
.driver-phone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1a1a1a;
  font-size: 14px;
}

.driver-phone {
  color: #666;
  font-size: 10px;
}

.driver-name i,
.driver-phone i {
  color: #2c58a2;
}

.actions-column {
  display: flex;
  gap: 10px;
}

.done-btn {
  width: 100%;
  min-height: 48px;
  border-radius: 8px;
  border: 0;
  background: #2c58a2;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
}

.done-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reject-btn {
  background: #ef4444;
}

.todo-box {
  border: 1px dashed #e09f3e;
  background: #fff8e8;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  margin-top: 12px;
}

@media (max-width: 992px) {
  .preparing-container {
    padding-inline: 12px;
  }

  .preparing-title {
    font-size: 22px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .sent-product-row {
    grid-template-columns: 1fr;
  }

  .product-images-row {
    justify-content: flex-start;
  }
}
</style>
