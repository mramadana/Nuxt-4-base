<template>
    <div>
        <div class="row">
            <div class="col-12 col-xl-10 mr-auto">
                <div class="row">
                    <div class="col-12 col-md-6 mb-3" v-for="complaint in complaints" :key="complaint.id">
                        <div class="order-box">
                            <div class="info">
                                <div class="head-title">
                                    <h3 class="main-title normal mb-0"><span>{{ $t('Global.complaint_number') }}</span> : <span>{{ complaint.id }}</span></h3>
                                </div>
                                <h4 class="order-info main-desc">{{ complaint.complaint }}</h4>
                                <div class="order-status">
                                    <div class="status">
                                        <span>{{ $t('complaintsDialog.status_complaint') }}</span> : <span class="hint-status">{{ complaint.status }}</span>
                                    </div>
                                    <nuxt-link class="order-link" :to="'/complaints/' + complaint.id">
                                        <i class="fa-solid fa-eye"></i>
                                        {{ $t('Global.view_complaint_details') }}
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props: {
        complaints: Array,
    },

}
</script>

<style lang="scss" scoped>
    .order-box {
        padding: 10px 15px;
        box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
        background: #fff;
        border-radius: 10px;
        display: flex;
        transition: transform .3s ease-out;
        &:hover {
            transform: translatey(-10px) scale(1.02);
        }
        @media (max-width: 768px) {
            flex-direction: column;
        }
        .order-img {
            width: 125px;
            height: 128px;
            object-fit: cover;
            border-radius: 10px;
            margin-inline-end: 20px;
            @media (max-width: 768px) {
                margin-inline-end: 0;
                width: 100%;
                margin: 0 auto 20px;
            }
        }
        .info {
            width: 100%;
            text-align: start;
            .head-title {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                .hint {
                    font-size: 12px;
                    color: #989898;
                }
            }
            .order-status {
                display: flex;
                align-items: center;
                justify-content: space-between;
                @media (max-width: 350px) {
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .status {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    color: #989898;
                    font-size: 14px;
                    .hint-status {
                        color: var(--main);
                    }
                    
                    @media (max-width: 1024px) {
                       font-size: 13px;
                    }
                }
                .order-link {
                    color: #000;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    @media (max-width: 1024px) {
                       font-size: 12px;
                    }
                    i {
                        font-size: 14px;
                        color: var(--main);
                    }
                }
            }
        }

        .main-title {
            @media (max-width: 768px) {
                font-size: 14px;
            }
        }
    }
</style>

