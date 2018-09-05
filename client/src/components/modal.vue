<template>
    <div class="wrapper" id="wrapper" v-if="show" @touchmove.stop :style = "{background:'rgba(0,0,0,'+option.opacity+')'}">
        
            <div class="inner">
                
                    <div class="content">
                        <div class="text-title">
                            <div name="content-title">{{option.title}}</div>
                        </div>
                        <div class="text-content">
                            <div name="content-content">{{option.content}}</div>
                        </div>
                    </div>
               
               
                    <div class="footer">
                        <div class="btn-wrapper">
                            
                            <button v-if = "option.showCancel" @click = "cancel" class="cancel" hover-stop-propagation id="cancel">{{option.cancelText}}</button>
                            
                        </div>
                        <div class="separator"></div>
                        <div class="btn-wrapper">
                            
                            <button v-if = "option.type" @click = "confirm" :open-type="option.type" id="confirm" class="confirm">{{option.confirmText}}</button>
                            <button v-else  id="confirm" @click = "confirm" class="confirm">{{option.confirmText}}</button>
                            
                        </div>
                    </div>
                
            </div>
        
    </div>
</template>
<script>
export default {
    props: ['show', 'option'],
    data() {
        return {};
    },
    methods: {
        confirm() {
            this.show = false;
            this.$emit('confirm');
            this.$emit('complete');
        },
        cancel() {
            this.show = false;
            this.$emit('cancel');
            this.$emit('complete');
        },
    },
    mounted() {},
};
</script>
<style lang="less" scoped>
.wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner {
        position: relative;
        top: -8.2%;
        width: 80%;
        background: #fff;
        border-radius: 8rpx;

        .content {
            padding: 30rpx 50rpx;

            .text-title {
                font-size: 36rpx;
                color: #000;
                text-align: center;
            }
            .text-content {
                margin-top: 20rpx;
                font-size: 32rpx;
                color: #999;
                text-align: center;
            }
        }
        .footer {
            display: flex;
            align-content: center;
            justify-content: center;
            border-top: #ccc solid 1px;

            .btn-wrapper {
                flex-grow: 1;
                .item() {
                    display: flex;
                    justify-content: center;
                    align-self: center;
                    position: relative;
                    padding: 20rpx;
                    font-size: 36rpx;
                    line-height: normal;

                    &:after {
                        border: none;
                    }
                }
                .cancel {
                    .item();
                    color: #000;
                }
                .confirm {
                    .item();
                    color: #60d426;
                }
            }

            .separator {
                width: 1px;
                background: #ccc;
            }
        }
    }
}
</style>
