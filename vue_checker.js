var api = 'https://api.init7.net/';

Vue.component('plz-result', {
    props: ['entry'],
    template: `
        <li>{{entry.zip + " " entry.town}}<li>
        `
})

var app = new Vue({
    el: '#app',
    data: {
        plz: '',
        strasse: '',
        house_nr: '',
        plz_valid: false,
        info: '',
        plz_orte: [],
        strassen: [],
        test: 'test'
    },
    watch: {
        plz: function () {
            if (this.plz.length > 1) {
                this.getPlzCity();
            }


            if (this.plz.length == 4) {
                this.plz_valid = true;
            } else {
                this.plz_valid = false;
            }
        }
    },
    computed:{
        ort: function(){
            if(this.plz.length != 4){
                return 'bitte geben sie eine PLZ ein'
            }else if(this.plz.length == 4 && this.plz_orte.length==0){
                return 'plz nicht bekannt'
            }else{
                return this.plz_orte[0].town
            }
        }
    },
    methods: {
        getPlzCity: function () {
            var vm = this
            axios.get(api + 'post/zip/' + this.plz + '/')
                .then(function (response) {
                    console.log(vm.plz_orte)
                    vm.plz_orte = response.data
                    console.log(vm.plz_orte)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getStreet: function () {
            if (this.plz_orte.length == 1) {
                var vm = this
                axios.get(api + 'post/streets/' + this.plz + '/' + this.strasse)
                    .then(function (response) {
                        console.log(vm.plz_orte)
                        vm.plz_orte = response.data
                        console.log(vm.plz_orte)
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
        },
        select_plz: function (event) {
            splitArray = event.target.innerText.split(" ")
            console.log(splitArray[0])
            this.plz = splitArray[0]
            //splitArray.shift()
            //console.log(splitArray.join())
            //this.ort = splitArray.join()
        }
    }
})
