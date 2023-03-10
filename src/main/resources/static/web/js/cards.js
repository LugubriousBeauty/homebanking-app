const { createApp } = Vue;

createApp({
    data() {
        return {
            client: {},
            cards: [],
            checked: undefined,
            debitCards: [],
            creditCards: [],
            type: undefined,
            color: undefined,
            cardNumber: '',
            date: '',
            toAccount: ''
        }
    },
    created() {
        this.checked = JSON.parse(localStorage.getItem("checked"))
        this.loadData();
    },
    methods: {
        loadData() {
            this.date = new Date().toISOString().split('T')[0]
            console.log(this.date)
            console.log(this.cards)
            axios.get('/api/clients/current')
                .then(data => {
                    this.client = data.data;
                    this.cards = data.data.cards;
                    console.log(this.cards)
                    this.debitCards = this.cards.filter((card) => card.type === "DEBIT")
                    this.creditCards = this.cards.filter((card) => card.type === "CREDIT")
                })
                .catch(err => console.log(err))
        },
        click() {
            axios.post('/api/logout').then(response => window.location.href = "/web/index.html")
        },
        async createCard() {
            if(!this.toAccount) {
                this.toAccount = 'a';
            }
            if(!this.type || !this.color || !this.toAccount) {
                swal.fire(`Please fill in all the data`, ">:C", 'error')
            } else {
                const { value: question } = await swal.fire({
                    icon: 'question',
                    title: 'Are you sure?',
                    text: `You are about to create a ${(this.type).toLowerCase()} ${(this.color).toLowerCase()} card`,
                    showCancelButton: true
                })
                if(question) {
                    axios.post('/api/clients/current/cards', `color=${this.color}&type=${this.type}&accountNumber=${this.toAccount}`)
                    .then(response => this.loadData())
                    .catch(err => swal.fire(`You already have a ${this.type} ${this.color} card`, "we're sorry :P", 'error'))
                }
            }
        },
        deleteCard() {
            console.log(this.cards)
            console.log(this.cardNumber)
            let cardId = this.cards.find(card => card.number == this.cardNumber)
            console.log(cardId.id)
            axios.delete(`/api/clients/current/cards?id=${cardId.id}`)
                .then(response => {
                    swal.fire(`Card succesfully deleted`, ":)", 'success');
                    this.loadData();
                })
                .catch(err => console.log(err))
        }
    },
    computed: {
        saveOnLocalStorage() {
            localStorage.setItem("checked", JSON.stringify(this.checked));
            console.log(this.checked)
        }
    }

}).mount('#app')