<template>
    <div class="row">
        <div class="col-12 col-xl-10 mr-auto">
            <div class="row">
                <div class="col-12 col-md-6 mb-4" v-for="i in 4" :key="i">
                    <div class="order-box">
                            <div class="info">
                                <div class="head-title">
                                    <Skeleton height=".7rem" width="30%" class="mb-2"></Skeleton>
                                </div>

                                <div class="order-status">
                                    <div class="status">
                                        <Skeleton width="70px" height=".7rem"></Skeleton> : <span class="hint-status"><Skeleton width="70px" height=".7rem"></Skeleton></span>
                                    </div>

                                    <Skeleton width="20%" height=".7rem"></Skeleton>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
