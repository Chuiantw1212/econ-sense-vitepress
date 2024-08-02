<template>
    <div class="books">
        <div v-for="(item, index) in modelValue" class="book" :key="index">
            <h3 class="book__header" v-show="item.name">
                {{ item.name }}
            </h3>
            <div class="book__body">
                <a class="book__link" :href="getApredir(item)" target="_blank">
                    <img class="link__image" :src="getImageLink(item)">
                </a>
                <div class="book__textGroup">
                    <div v-show="item.desc" v-html="item.desc">
                    </div>
                </div>
            </div>
            <div class="book__footer">
                <VPButton :href="getApredir(item)" text="讀冊生活"></VPButton>
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
                {
                    id: '',
                    name: '',
                    desc: '',
                }
            ]
        }
    },
})
// methods
function getApredir(item) {
    const apRedir = "https://www.taaze.tw/apredir.html?154858690"
    const prdLink = `https://www.taaze.tw/usedList.html?oid=${item.id}`
    return `${apRedir}/${prdLink}`
}
function getImageLink(item) {
    const height = 480
    const width = 310
    const showThumbnailLink = 'https://media.taaze.tw/showThumbnail.html'
    return `${showThumbnailLink}?sc=${item.id}&height=${height}&width=${width}`
}
</script>
<style lang="scss" scoped>
.books {
    display: flex;
    gap: 40px;
    flex-direction: column;
}

.book {
    display: flex;
    flex-direction: column;

    .book__header {
        text-align: center;
    }

    .book__body {
        margin-top: 20px;

        .book__link {
            display: flex;
            justify-content: center;
            align-self: center;
        }
    }

    .book__footer {
        display: flex;
        justify-content: center;
    }
}

@media screen and (min-width: 992px) {
    .books {
        gap: 0px;
    }

    .book {
        display: flex;
        flex-direction: column;

        .book__header {
            text-align: left;
        }


        .book__body {
            display: flex;
            flex-direction: row;
            gap: 20px;
            margin-top: 20px;
            align-items: center;
        }

        .book__link {
            flex-basis: 20%;
        }

        .book__textGroup {
            flex-basis: 80%;
        }
    }

}
</style>