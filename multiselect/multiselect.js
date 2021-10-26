class MultiSelect{
    constructor(selector, opts){
        this.$root = document.querySelector(selector)
        this.$toggler = null
        this.opts = opts

        this.$selects = null
        this.$inputs = null
        this.selectedItems = {}
        this.#render()
        this.#setup()
    }

    #render() {
        let inputs = ''
        let items = ''
        let index = 0
        for(const [key, value] of Object.entries(this.opts.data)) {
            inputs += `<div class="multiselect__dropdown__inputs__item">
            <input type='number' data-for='${key}' placeholder='Кол-во'/>
            </div>`
            items += `<div class="multiselect__dropdown__item" data-index='${index}' data-for='${key}'>
            <div class="multiselect__dropdown_title">${value}</div>
            </div>`
            index++
        }
        let html = `<div class="multiselect__input">
                ${this.opts.title ?? "Выберите елемент"}
                <span>▶</span>
            </div>
            <div class="multiselect__dropdown__inputs">
                ${inputs}
            </div>
            <div class="multiselect__dropdown">
                ${items}
            </div>`
        
        this.$root.innerHTML = html
        this.$toggler = this.$root.querySelector('.multiselect__input')

        this.$selects = this.$root.querySelectorAll('.multiselect__dropdown__item')
        this.$inputs = this.$root.querySelectorAll('.multiselect__dropdown__inputs__item input')
    }
    #setup() {
        for(const [key, value] of Object.entries(this.opts.data)) {
            this.selectedItems[key] = {title: value, selected: false, amount: 0}
        }
        this.$toggler.addEventListener('click', () => {
            this.$root.classList.toggle('open')
        })
        this.$selects.forEach(el => {
            el.addEventListener('click', () => {
                if(el.classList.contains('selected')){
                    this.opts.onDeselect ? this.opts.onDeselect(el) : null
                    el.classList.remove('selected')
                    el.firstChild.textContent = ''
                    this.$inputs[parseInt(el.dataset.index)].parentElement.style.transform = 'translateX(0)'
                    this.selectedItems[el.dataset.for]['selected'] = false

                }
                else{
                    this.opts.onSelect ? this.opts.onSelect(el) : null
                    el.classList.add('selected')
                    el.firstChild.textContent += '✅'
                    this.$inputs[parseInt(el.dataset.index)].parentElement.style.transform = 'translateX(210%)'
                    this.selectedItems[el.dataset.for]['selected'] = true
                }
                
            })
        })

        if(this.opts.onInput) {
            this.$inputs.forEach(el => {
                el.addEventListener('change', (el) => this.opts.onInput(el))
            })
        }
    }

    gatherInfo() {
        for(const [key, value] of Object.entries(this.selectedItems)) {
            if (value.selected) {
                
                this.$inputs.forEach(el => {
                    if(el.dataset.for === key) {
                        this.selectedItems[key].amount = el.value || 0
                    }
                })
            }
        }

        return this.selectedItems
    }
}