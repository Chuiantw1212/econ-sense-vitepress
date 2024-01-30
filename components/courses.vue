<template>
    <div class="courses">
        <div v-for="(item, index) in modelValue" class="course" :key="index">
            <!-- <hr> -->
            <h3 class="course__header" v-if="item.name">
                {{ item.name }}
            </h3>
            <div class="course__body">
                <a class="course__link" :href="item.url" target="_blank">
                    <img class="link__image" :src="item.image">
                </a>
                <div class="course__textGroup">
                    <div v-if="item.description" v-html="item.description">
                    </div>
                </div>
            </div>
            <div class="course__footer">
                <VPButton :href="item.url" text="前往學習">前往學習</VPButton>
            </div>
            <br>
            <hr>
        </div>
    </div>
</template>
<script setup>
import {
    VPButton,
} from 'vitepress/theme'
const props = defineProps({
    modelValue: {
        type: Array,
        default: function () {
            return [
                // https://schema.org/Course
                {
                    // id: '',
                    image: '',
                    description: '',
                    name: '',
                    url: '',
                }
            ]
        }
    },
})
</script> 
<style lang="scss" scoped>
.courses {
    display: flex;
    gap: 40px;
    flex-direction: column;

    .course {
        display: flex;
        flex-direction: column;

        .course__header {
            text-align: center;
        }

        .course__body {
            margin-top: 20px;

            .course__link {
                display: flex;
                justify-content: center;
                align-self: center;
            }
        }

        .course__footer {
            display: flex;
            justify-content: center;
        }
    }
}


@media screen and (min-width: 992px) {
    .courses {
        gap: 0px;

        .course {
            display: flex;
            flex-direction: column;

            .course__header {
                text-align: left;
            }


            .course__body {
                display: flex;
                flex-direction: row;
                gap: 20px;
                margin-top: 20px;
                align-items: center;
            }

            .course__link {
                flex-basis: 30%;
            }

            .course__textGroup {
                flex-basis: 70%;
            }
        }
    }


}
</style>