import { ref } from 'vue'

function useMenu(){
const menuIsOpen = ref(false)
    
const toggleMenu = () => {
        menuIsOpen.value = !menuIsOpen.value
    }
    return { menuIsOpen, toggleMenu }
}

export default useMenu