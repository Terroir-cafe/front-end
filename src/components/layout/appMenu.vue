<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menuRoutes = computed(()=> router.getRoutes()
.filter(route => route.meta?.menu !== false && route.name)
.map(route => ({name: route.name, path: route.path}))
)
</script>
<template>
    <div class="app-menu">
        <h2>Menu</h2>
        <ul>
        <li v-for="route in menuRoutes" :key="route.path" @click="router.push(`${route.path}`)">
            <p>{{ route.name }}</p>
        </li>
        </ul>
    </div>
</template>
<style scoped>
.app-menu p{
    text-decoration: none;
    color: inherit;
    font-size: 1.5rem;
}
.app-menu h2{
    font-size: 2rem;
    margin-bottom: 1rem;
    color:#fff;
    margin-left: 2vw;
}

.app-menu{
    position: absolute;
    top: 60px;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: #6d423b;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}
.app-menu ul{
    list-style: none;
    padding: 2vw;
    margin: 0;
    margin: 1vh 0 0 0; 
}

.app-menu li{
    margin-bottom: 1rem;
    padding: 2vw;
    border: 2px solid #fff;
    color: #fff;
    border-radius: 35px;
}
.app-menu li:active{
    background-color: #fff;
    color: #6d423b;
    border: 2 px solid #6d423b;
    transition: background-color 0.5s, color 0.5s, border 0.5s;
}
</style>